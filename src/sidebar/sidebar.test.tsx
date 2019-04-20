jest.mock("./styles.less", () => jest.fn());

import { Root } from "./sidebar";

describe("deleteAllContent", () => {
  it("calls deleteById and showNotification", async () => {
    let rtb = {
      board: {
        widgets: {
          get: jest.fn(async () => []),
          deleteById: jest.fn(async () => null)
        }
      },
      showNotification: jest.fn(async () => null)
    };
    // @ts-ignore
    global.rtb = rtb;
    await Root.prototype.deleteAllContent();
    expect(rtb.board.widgets.get).toHaveBeenCalled();
    expect(rtb.board.widgets.deleteById).toHaveBeenCalled();
    expect(rtb.showNotification).toHaveBeenCalled();
  });
});
