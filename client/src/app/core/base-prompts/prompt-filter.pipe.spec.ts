import { PromptFilterPipe } from "./prompt-filter.pipe";

describe('FilterPipe', () => {
  it('create an instance', () => {
    const pipe = new PromptFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
