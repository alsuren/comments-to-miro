import * as info from "./info";

describe("loadInfoRequest", () => {
  it("Sets loading in the store", () => {
    expect(
      info.reducer(
        undefined,
        info.loadInfoRequest(),
      )
    ).toEqual(
      {
        loading: true,
        err: null,
        info: null,
      }
    )
  })
})

describe("loadInfoFailure", () => {
  it("Sets loading in the store", () => {
    expect(
      info.reducer(
        undefined,
        info.loadInfoFailure('nah mate'),
      )
    ).toEqual(
      {
        loading: false,
        err: 'nah mate',
        info: null,
      }
    )
  })
})

describe("loadInfoSuccess", () => {
  it("Sets loading in the store", () => {
    expect(
      info.reducer(
        undefined,
        info.loadInfoSuccess('yeah mate'),
      )
    ).toEqual(
      {
        loading: false,
        err: null,
        info: 'yeah mate',
      }
    )
  })
})

describe("loadInfo", () => {
  it("calls info.get() and dispatches the result", async () => {
    let rtb = {
      board: {
        info: {
          get: jest.fn(async () => 'yeah mate'),
        }
      }    
    };
    // @ts-ignore
    global.rtb = rtb;
    const dispatch = jest.fn()
    await info.loadInfo()(dispatch);
    expect(rtb.board.info.get).toHaveBeenCalled();
    expect(dispatch).toHaveBeenLastCalledWith(
      info.loadInfoSuccess('yeah mate')
    )
  });
});
