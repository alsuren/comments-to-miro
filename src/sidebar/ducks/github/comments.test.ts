import * as comments from "./comments";

describe("loadCommentsRequest", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsRequest(),
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

describe("loadCommentsFailure", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsFailure('nah mate'),
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

describe("loadCommentsSuccess", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsSuccess('yeah mate'),
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

describe("loadComments", () => {
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
    await comments.loadComments()(dispatch);
    expect(rtb.board.info.get).toHaveBeenCalled();
    expect(dispatch).toHaveBeenLastCalledWith(
      comments.loadCommentsSuccess('yeah mate')
    )
  });
});
