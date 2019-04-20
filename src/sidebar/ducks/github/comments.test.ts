import * as comments from "./comments";

describe("loadCommentsRequest", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsRequest('hi'),
      )
    ).toEqual(
      {
        loading: 'hi',
        err: null,
        comments: null,
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
        comments: null,
      }
    )
  })
})

describe("loadCommentsProgress", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsProgress(['yeah mate']),
      )
    ).toEqual(
      {
        loading: false,
        err: null,
        comments: ['yeah mate'],
      }
    )
  })
})

describe("loadCommentsSuccess", () => {
  it("Sets loading in the store", () => {
    expect(
      comments.reducer(
        undefined,
        comments.loadCommentsSuccess(),
      )
    ).toEqual(
      {
        loading: false,
        err: null,
        comments: null,
      }
    )
  })
})

describe("loadComments", () => {
  it("calls comments.get() and dispatches the result", async () => { 
    // @ts-ignore
    global.fetch = jest.fn(async () => (
      {
        json: async () => ['yeah mate'],
        headers: {
          get: () => ''
        },
      }));
    const dispatch = jest.fn()
    await comments.loadComments()(dispatch);
    expect(fetch).toBeCalledWith('https://api.github.com/repos/rust-lang/rfcs/issues/243/comments');
    expect(dispatch).toHaveBeenCalledWith(
      comments.loadCommentsProgress(['yeah mate'])
    )
  });
});
