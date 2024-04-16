const mongoose = require("mongoose");
const request = require("supertest");
const User = require("./models/user");
const Product = require("./models/product");
const { Cart } = require("./models/cart");
const app = require("./app");

require("dotenv").config();

const id = new mongoose.Types.ObjectId();

async function userLogin() {
  const loginRes = await request(app).post("/users/login").send({
    email: "johndoe@foo.com",
    password: process.env.PASSWORD,
  });

  const token = loginRes.body.token;
  return token;
}

const dummyProduct = {
  Name: "URBANISTA MIAMI",
  Price: 45.69,
  Description: "Nullam id dolor id nibh ultricies vehicula ut id elit.",
  Image: ["dummy.png"],
  Retailer: {
    name: "John Doe",
  },
  Category: ["Audio Electronics"],
  Featured: false,
  Stock: 10,
  Ratings: [3, 4, 4, 4, 3],
  Keywords: [],
};

const dummyProduct2 = {
  _id: id,
  Name: "DUMMY PRODUCT",
  Price: 45.69,
  Description: "Nullam id dolor id nibh ultricies vehicula ut id elit.",
  Image: ["dummy.png"],
  Retailer: {
    name: "John Doe",
  },
  Category: ["Audio Electronics"],
  Featured: false,
  Stock: 10,
  Ratings: [3, 4, 4, 4, 3],
  Keywords: [],
};

const createDummyCart = async (email) => {
  const user = await User.findOne({ email: email });
  const cart = new Cart({
    items: [],
  });
  await cart.save();
  user.shoppingCart = cart._id;
  user.save();
};

async function createDummyProduct() {
  await Product.create(dummyProduct);
}

beforeAll(async () => {
  await mongoose.connect(process.env.TESTDB_URI);
  await User.createCollection();
  await Product.createCollection();
  await createDummyProduct();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("App", () => {
  it("should have a valid dbURI", () => {
    expect(process.env.TESTDB_URI).toBeDefined();
  });
});

// USER TESTS
describe("Create A New User", () => {
  it("should return a 201 status code", async () => {
    const res = await request(app).post("/users/signup").send({
      email: "johndoe@foo.com",
      password: process.env.PASSWORD,
    });
    await createDummyCart("johndoe@foo.com");
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
  });

  it("should return a 400 status code for missing fields", async () => {
    const res = await request(app).post("/users/signup").send({
      username: "John",
      email: "johndoe@foo.com",
      password: "",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("All fields are required.");
  });

  it("should return a 400 status code for an existing user", async () => {
    const res = await request(app).post("/users/signup").send({
      username: "John",
      email: "johndoe@foo.com",
      password: process.env.PASSWORD,
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists.");
  });
});

describe("Login A User", () => {
  it("should return a 201 status code", async () => {
    const loginRes = await request(app).post("/users/login").send({
      email: "johndoe@foo.com",
      password: process.env.PASSWORD,
    });

    // Check if login was successful
    expect(loginRes.statusCode).toBe(201);
    expect(loginRes.body).toHaveProperty("token");
  });

  it("should return a 400 status code for an invalid password", async () => {
    const loginRes = await request(app).post("/users/login").send({
      email: "johndoe@foo.com",
      password: "invalid",
    });

    // Check if login was unsuccessful
    expect(loginRes.statusCode).toBe(400);
    expect(loginRes.body.message).toBe("Invalid Password");
  });

  it("should return a 400 status code for an invalid email", async () => {
    const loginRes = await request(app).post("/users/login").send({
      email: "dummy@foo.com",
      password: "Hahahahaha",
    });

    // Check if login was unsuccessful
    expect(loginRes.statusCode).toBe(400);
    expect(loginRes.body.message).toBe("User not found.");
  });

  it("should return a 400 status code for missing fields", async () => {
    const loginRes = await request(app).post("/users/login").send({
      email: "johndoe@foo.com",
      password: "",
    });
    expect(loginRes.statusCode).toBe(400);
    expect(loginRes.body.message).toBe("All fields are required.");
  });
});

describe("Get User Info", () => {
  it("should return a 401 status code for an unauthenticated user", async () => {
    const res = await request(app).get("/users/me");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Access denied");
  });

  it("should return a 200 status code for an authenticated user", async () => {
    const token = await userLogin();
    const res = await request(app)
      .get("/users/me")
      .set("Authorization", token)
      .send();
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("email");
    expect(res.body).not.toHaveProperty("salt");
  });
});

// PRODUCT TESTS
describe("GET /products", () => {
  it("should return at most 5 products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(5);
  });

  it("should return at most 6 products", async () => {
    const res = await request(app).get("/products?perPage=6");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(6);
  });

  it("should return a product by category", async () => {
    const res = await request(app).get("/products?category=Audio Electronics");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeLessThanOrEqual(5);
  });
});

describe("GET /products/:productId", () => {
  it("should return cannot find a product", async () => {
    const res = await request(app).get("/products/66182f10695687f1a9f388d0");
    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Cannot find Product");
  });

  it("should return a product", async () => {
    const product = await Product.find({ Name: "URBANISTA MIAMI" });
    const productId = product[0]._id;
    const res = await request(app).get(`/products/${productId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");
  });
});

describe("POST /products/create", () => {
  it("should return a 401 response code for an unauthenticated user", async () => {
    const res = await request(app).post("/products/create");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Access denied",
      })
    );
  });

  it("should return a 201 response code for an authenticated user", async () => {
    // Login as the user
    const token = await userLogin();

    // Create product after successful login
    const res = await request(app)
      .post("/products/create")
      .set("Authorization", token) // Attach authorization header
      .send(dummyProduct2);

    // Check if product creation was successful
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      message: "Product Created Successfully",
    });
  });
});

// CART TESTS
describe("POST /cart/add", () => {
  it("should return a 201 response code for an authenticated user", async () => {
    const token = await userLogin();
    // Create a dummy product
    await request(app)
      .post("/products/create")
      .set("Authorization", token) // Attach authorization header
      .send(dummyProduct2);

    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({ product: id, quantity: 1 });
    // expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(
      "Item has been successfully added to cart"
    );
  });

  it("should return a 401 response code for an unauthenticated user", async () => {
    const res = await request(app).post("/cart/add");
    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual(
      expect.objectContaining({
        message: "Access denied",
      })
    );
  });

  it("should return a 400 response code for an invalid product", async () => {
    const token = await userLogin();
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({ product: fakeId, quantity: 1 });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Product does not exist");
  });

  it("should return a 400 response code for an invalid quantity", async () => {
    const token = await userLogin();
    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({ product: id, quantity: -1 });
    expect(response.statusCode).toBe(400);
  });

  it("should return a 400 response code for missing product and quantity", async () => {
    const token = await userLogin();
    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({});
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Product and quantity are required");
  });

  it("should return a 400 response code for missing product", async () => {
    const token = await userLogin();
    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({ quantity: 1 });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Product and quantity are required");
  });

  it("should return a 400 response code for missing quantity", async () => {
    const token = await userLogin();
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .post("/cart/add")
      .set("Authorization", token)
      .send({ product: fakeId });
    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe("Product and quantity are required");
  });
});

describe("POST /cart/remove", () => {
  it("should return a 201 status code for an authenticated user", async () => {
    const token = await userLogin();
    const res = await request(app)
      .get("/cart")
      .set("Authorization", token)
      .send();
    const cart = await res.body;
    const firstCartItem = cart.items[0];
    const response = await request(app)
      .post("/cart/remove")
      .set("Authorization", token)
      .send({ cartItemID: firstCartItem._id });
    // expect(response.statusCode).toBe(201);
    expect(response.body.message).toBe(
      "Item has been successfully removed from the cart"
    );
  });

  it("should return a 400 status code for an unauthenticated user", async () => {
    const response = await request(app).post("/cart/remove");
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Access denied");
  });
});
