import { parseAuctionListPage } from '../lib/crawler';

const MOCK_HTML = `
<html><body>
<table class="caseList">
  <tr>
    <td><a href="/app/case/detail/123">令6(ケ)第1234号</a></td>
    <td>東京地方裁判所</td>
    <td>東京都渋谷区代々木1-1-1 201号室</td>
    <td>12,000,000円</td>
    <td>2024-04-22</td>
  </tr>
  <tr>
    <td><a href="/app/case/detail/456">令6(ケ)第5678号</a></td>
    <td>大阪地方裁判所</td>
    <td>大阪府大阪市中央区本町1-2-3</td>
    <td>8,500,000円</td>
    <td>2024-05-10</td>
  </tr>
</table>
</body></html>
`;

describe('parseAuctionListPage', () => {
  it('テーブルから物件を2件抽出できる', () => {
    const result = parseAuctionListPage(MOCK_HTML, '13');
    expect(result).toHaveLength(2);
  });

  it('マンション号室からproperty_typeがapartmentになる', () => {
    const result = parseAuctionListPage(MOCK_HTML, '13');
    expect(result[0].property_type).toBe('apartment');
  });

  it('base_priceが数値として抽出される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '13');
    expect(result[0].base_price).toBe(12000000);
  });

  it('idがcourt_プレフィックスで生成される', () => {
    const result = parseAuctionListPage(MOCK_HTML, '13');
    expect(result[0].id).toMatch(/^court_13_/);
  });

  it('空のテーブルは空配列を返す', () => {
    const result = parseAuctionListPage('<table class="caseList"></table>', '13');
    expect(result).toHaveLength(0);
  });
});
