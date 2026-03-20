
function getPaymentHint(method){
  const cfg = window.SITE_CONFIG || {};
  if(method === "LINE Pay") return cfg.paymentPageLinePay || "";
  if(method === "綠界信用卡/ATM") return cfg.paymentPageEcpay || "";
  if(method === "銀行轉帳") return cfg.paymentPageBank || "bank-transfer.html";
  return "";
}
async function submitOrderForm(e){
  e.preventDefault();
  const form = document.getElementById("orderForm");
  const data = Object.fromEntries(new FormData(form).entries());
  data.amount = data.product === "維納斯羅盤塔羅-電子書" ? "680" : "980";
  const resultBox = document.getElementById("resultBox");
  resultBox.className = "notice";
  resultBox.textContent = "送出中，請稍候...";
  const endpoint = window.SITE_CONFIG && window.SITE_CONFIG.orderEndpoint;
  const paymentUrl = getPaymentHint(data.payment_method);
  if(!endpoint || endpoint.includes("PASTE_YOUR")){
    resultBox.innerHTML = "請先到 <b>config.js</b> 貼上 Apps Script Web App URL。";
    return;
  }
  try{
    const resp = await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const json = await resp.json();
    if(json.success){
      resultBox.className = "notice success";
      resultBox.innerHTML = `訂單送出成功。<br>訂單編號：<b>${json.order_no || "已建立"}</b>${paymentUrl ? `<br><a class="btn primary" style="margin-top:10px" href="${paymentUrl}" target="_blank">前往付款</a>` : ""}`;
      form.reset();
    }else{
      resultBox.textContent = "送出失敗，請稍後再試。";
    }
  }catch(err){
    resultBox.textContent = "送出失敗：" + err.message;
  }
}
