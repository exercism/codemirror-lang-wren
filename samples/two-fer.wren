class TwoFer {
  static twoFer() {
    return "One for you, one for me."
  }
  static twoFer(name) {
    """a long " string """
    "\x48"
    "\u0041"
    "\U0001F64A"

    return "One for %(name), one for \x58 me."
  }
}

