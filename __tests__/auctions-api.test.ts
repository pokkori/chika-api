import { parseAuctionListPage, detectPropertyType } from '../lib/crawler';

describe('detectPropertyType', () => {
  it('号室を含む住所はapartmentになる', () => {
    expect(detectPropertyType('東京都渋谷区代々木1-1-1 201号室')).toBe('apartment');
  });

  it('マンションを含む住所はapartmentになる', () => {
    expect(detectPropertyType('代々木マンション101')).toBe('apartment');
  });

  it('田を含む住所はfarmになる', () => {
    expect(detectPropertyType('長野県諏訪市田辺123')).toBe('farm');
  });

  it('建物を含む住所はbuildingになる', () => {
    expect(detectPropertyType('大阪府大阪市 建物全部')).toBe('building');
  });

  it('何も含まない住所はlandになる', () => {
    expect(detectPropertyType('東京都渋谷区代々木1-1-1')).toBe('land');
  });
});

describe('parseAuctionListPage - フィールド検証', () => {
  const MOCK_HTML = `
  <html><body>
  <table class="caseList">
    <tr>
      <td><a href="/app/case/detail/789">令6(ケ)第9999号</a></td>
      <td>横浜地方裁判所</td>
      <td>神奈川県横浜市中区本町1-2</td>
      <td>5,000,000円</td>
      <td>2024-06-30</td>
    </tr>
  </table>
  </body></html>
  `;

  it('courtフィールドが正しく抽出される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].court).toBe('横浜地方裁判所');
  });

  it('case_numberフィールドが正しく抽出される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].case_number).toBe('令6(ケ)第9999号');
  });

  it('auction_end_dateフィールドが正しく抽出される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].auction_end_date).toBe('2024-06-30');
  });

  it('statusはopenがデフォルトである', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].status).toBe('open');
  });

  it('court_urlが正しく設定される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].court_url).toContain('/app/case/detail/789');
  });

  it('prefCodeが14のとき、idがcourt_14_で始まる', () => {
    const result = parseAuctionListPage(MOCK_HTML, '14');
    expect(result[0].id).toMatch(/^court_14_/);
  });
});

describe('parseAuctionListPage - エッジケース', () => {
  it('価格が0円の行はスキップされる', () => {
    const html = `
    <table class="caseList">
      <tr>
        <td><a href="/detail/1">令6(ケ)第111号</a></td>
        <td>東京地方裁判所</td>
        <td>東京都千代田区</td>
        <td>0円</td>
        <td>2024-04-01</td>
      </tr>
    </table>`;
    const result = parseAuctionListPage(html, '13');
    expect(result).toHaveLength(0);
  });

  it('セルが5未満の行はスキップされる', () => {
    const html = `
    <table class="caseList">
      <tr>
        <td>令6(ケ)第111号</td>
        <td>東京地方裁判所</td>
      </tr>
    </table>`;
    const result = parseAuctionListPage(html, '13');
    expect(result).toHaveLength(0);
  });
});
