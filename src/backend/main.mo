import Text "mo:core/Text";
import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Runtime "mo:core/Runtime";

actor {
  type Product = {
    id : Nat;
    name : Text;
    description : Text;
    price : Text;
    imageUrl : Text;
  };

  type Order = {
    id : Nat;
    productId : Nat;
    productName : Text;
    customerName : Text;
    contactNumber : Text;
    timestamp : Int;
  };

  var nextProductId = 7;
  var nextOrderId = 1;

  let products = Map.fromIter<Nat, Product>([
    (1, { id = 1; name = "Rustic Planter"; description = "Handcrafted wooden planter for indoor or outdoor use"; price = "50,000 COP"; imageUrl = "https://images.unsplash.com/photo-1464983953574-0892a716854b" }),
    (2, { id = 2; name = "Modern Lamp"; description = "Sleek, minimalist desk lamp with LED lighting"; price = "120,000 COP"; imageUrl = "https://images.unsplash.com/photo-1506744038136-46273834b3fb" }),
    (3, { id = 3; name = "Cozy Blanket"; description = "Soft, warm blanket perfect for chilly nights"; price = "80,000 COP"; imageUrl = "https://images.unsplash.com/photo-1519125323398-675f0ddb6308" }),
    (4, { id = 4; name = "Artisan Mug"; description = "Hand-painted ceramic mug, dishwasher safe"; price = "30,000 COP"; imageUrl = "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429" }),
    (5, { id = 5; name = "Wall Art Print"; description = "High-quality print of original artwork"; price = "60,000 COP"; imageUrl = "https://images.unsplash.com/photo-1465101046530-73398c7f28ca" }),
    (6, { id = 6; name = "Leather Journal"; description = "Durable, handmade leather journal for notes and sketches"; price = "100,000 COP"; imageUrl = "https://images.unsplash.com/photo-1482062364825-616fd23b8fc1" }),
  ].values());

  let orders = Map.empty<Nat, Order>();

  public query ({ caller }) func getProducts() : async [Product] {
    products.values().toArray();
  };

  public shared ({ caller }) func submitOrder(productId : Nat, productName : Text, customerName : Text, contactNumber : Text, timestamp : Int) : async Order {
    let order : Order = {
      id = nextOrderId;
      productId;
      productName;
      customerName;
      contactNumber;
      timestamp;
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  public query ({ caller }) func getAllOrders(adminPin : Text) : async [Order] {
    if (adminPin != "1234") {
      Runtime.trap("Invalid PIN");
    };
    orders.values().toArray();
  };

  public shared ({ caller }) func addProduct(name : Text, description : Text, price : Text, imageUrl : Text, adminPin : Text) : async Product {
    if (adminPin != "1234") {
      Runtime.trap("Invalid PIN");
    };
    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      imageUrl;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };
};
