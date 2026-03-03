module {
  type Actor = { nextProductId : Nat };
  public func run(old : Actor) : Actor {
    { old with nextProductId = 7 };
  };
};
