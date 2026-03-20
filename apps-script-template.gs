const SHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
const NOTIFY_EMAIL = 'your-email@example.com';
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || '{}');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheetByName('orders') || ss.insertSheet('orders');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['timestamp','order_no','name','phone','email','product','amount','payment_method','notes','status']);
    }
    const orderNo = 'GT-' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd-HHmmss');
    sheet.appendRow([new Date(),orderNo,data.name||'',data.phone||'',data.email||'',data.product||'',data.amount||'',data.payment_method||'',data.notes||'','待付款']);
    MailApp.sendEmail({
      to: NOTIFY_EMAIL,
      subject: '【古拉佛訂單通知】' + orderNo,
      htmlBody: '<h2>新訂單已建立</h2><p>訂單編號：<b>' + orderNo + '</b></p><p>姓名：' + (data.name||'') + '</p><p>電話：' + (data.phone||'') + '</p><p>Email：' + (data.email||'') + '</p><p>商品：' + (data.product||'') + '</p><p>金額：' + (data.amount||'') + '</p><p>付款方式：' + (data.payment_method||'') + '</p>'
    });
    return ContentService.createTextOutput(JSON.stringify({ success: true, order_no: orderNo })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
