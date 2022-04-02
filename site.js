function reset() {
  j = 0;
  sell = 0;
  buy = 0;
  tt = Date.now();
  rate = 0;
}

function commafy(num) {
  var str = num.toString().split(".");
  if (str[0].length >= 5) {
    str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
  }
  if (str[1] && str[1].length >= 5) {
    str[1] = str[1].replace(/(\d{3})/g, "$1 ");
  }
  return str.join(".");
}

const ws3 = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
var target = document.getElementById("foo"); // your canvas element

ws3.onopen = () => {
  j = 0;
  sell = 0;
  buy = 0;
  tt = Date.now();
  volumes = [];
  trades = [];

  html = "";

  // set actual value
};

ws3.onclose = () => {
  //ws.send();
};

ws3.onmessage = (e) => {
  $(".loader").hide();
  $(".content").css("display", "flex");
  let issell = JSON.parse(e.data).m;
  let price = JSON.parse(e.data).p;
  let amount = parseFloat(JSON.parse(e.data).q);
  let price_ = parseFloat(price).toFixed(0);
  let limit = parseFloat($("#limit").val());
  let sell_ = parseFloat(sell).toFixed(4);
  let buy_ = parseFloat(buy).toFixed(4);
  $(".pricenow").html(commafy(price_));
  $(".selltotal").html(sell_);
  $(".buytotal").html(buy_);
  $(".limitamount").html(limit);

  if (issell) {
    sell += amount;

    if (typeof volumes[price_] == "undefined") {
      trades[0] = amount;
      trades[1] = 0;
    } else {
      trades[0] = volumes[price_][0] + amount;
      trades[1] = volumes[price_][1];
    }
    volumes[price_] = trades;
  } else {
    buy += amount;
    if (typeof volumes[price_] == "undefined") {
      trades[0] = 0;
      trades[1] = amount;
    } else {
      trades[0] = volumes[price_][0];
      trades[1] = volumes[price_][1] + amount;
    }
    volumes[price_] = trades;
  }

  Object.keys(volumes).forEach(function (key, index) {
    if (this[key][0].toFixed(4) >= limit || this[key][1].toFixed(4) >= limit) {
      if (key === price_) {
        if (issell) {
          html =
            html +
            '<div class="row sell"><div class="price">' +
            key +
            '</div><div class="vol">' +
            this[key][0].toFixed(4) +
            '</div><div class="vol">' +
            this[key][1].toFixed(4) +
            "</div></div>";
        } else {
          html =
            html +
            '<div class="row buy"><div class="price">' +
            key +
            '</div><div class="vol">' +
            this[key][0].toFixed(4) +
            '</div><div class="vol">' +
            this[key][1].toFixed(4) +
            "</div></div>";
        }
      } else {
        html =
          html +
          '<div class="row"><div class="price">' +
          key +
          '</div><div class="vol">' +
          this[key][0].toFixed(4) +
          '</div><div class="vol">' +
          this[key][1].toFixed(4) +
          "</div></div>";
      }
    }
  }, volumes);

  $(".main").html(html);
  html = "";
  trades = [];
};
