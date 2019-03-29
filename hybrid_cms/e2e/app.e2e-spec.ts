import { CleanUiPage } from './app.po';

describe('clean-ui App', () => {
  let page: CleanUiPage;

  beforeEach(() => {
    page = new CleanUiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
