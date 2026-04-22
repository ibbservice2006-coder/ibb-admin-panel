/**
 * Platform Logo URLs
 * Using official favicon/logo CDN URLs from each platform
 * Fallback to Google's favicon service if direct URL unavailable
 */

const G = (domain) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`

export const PLATFORM_LOGOS = {
  // === SE Asia ===
  shopee:       'https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/icon/icon-shopee.png',
  lazada:       G('lazada.com'),
  grab:         G('grab.com'),
  klook:        G('klook.com'),
  agoda:        G('agoda.com'),
  tiktok_shop:  G('tiktok.com'),
  tokopedia:    G('tokopedia.com'),

  // === Global ===
  amazon:       G('amazon.com'),
  ebay:         G('ebay.com'),
  booking:      G('booking.com'),
  expedia:      G('expedia.com'),
  getyourguide: G('getyourguide.com'),
  viator:       G('viator.com'),
  airbnb:       G('airbnb.com'),
  coupang:      G('coupang.com'),

  // === China ===
  taobao:       G('taobao.com'),
  tmall:        G('tmall.com'),
  jd:           G('jd.com'),
  ctrip:        G('ctrip.com'),
  fliggy:       G('fliggy.com'),
  meituan:      G('meituan.com'),
  pinduoduo:    G('pinduoduo.com'),
  xiaohongshu:  G('xiaohongshu.com'),
  douyin:       G('douyin.com'),
  wechat:       G('weixin.qq.com'),

  // === Middle East ===
  noon:         G('noon.com'),
  amazon_ae:    G('amazon.ae'),
  careem:       G('careem.com'),
  wego:         G('wego.com'),
  jahez:        G('jahez.net'),
  talabat:      G('talabat.com'),

  // === Russia ===
  ozon:         G('ozon.ru'),
  wildberries:  G('wildberries.ru'),
  yandex:       G('yandex.ru'),
  yandex_go:    G('yango.com'),
  avito:        G('avito.ru'),
  twogis:       G('2gis.ru'),

  // === Payment Methods ===
  stripe:       G('stripe.com'),
  omise:        G('omise.co'),
  payoneer:     G('payoneer.com'),
  wise:         G('wise.com'),
  alipay:       G('alipay.com'),
  wechat_pay:   G('weixin.qq.com'),
  paypal:       G('paypal.com'),
  grabpay:      G('grab.com'),
  bitkub:       G('bitkub.com'),
  promptpay:    G('promptpay.io'),
  truemoney:    G('truemoney.com'),
  linepay:      G('pay.line.me'),
  bitcoin:      G('bitcoin.org'),
  ethereum:     G('ethereum.org'),
  binance:      G('binance.com'),
  coinbase:     G('coinbase.com'),

  // === Korea ===
  gmarket:      G('gmarket.co.kr'),
  elevenst:     G('11st.co.kr'),

  // === Japan ===
  rakuten:      G('rakuten.co.jp'),
  yahoo_jp:     G('yahoo.co.jp'),

  // === India ===
  flipkart:     G('flipkart.com'),
  paytm:        G('paytm.com'),
}

/**
 * PlatformLogo component helper
 * Returns img props for a platform logo with fallback
 */
export function getPlatformLogoProps(key, size = 32) {
  const src = PLATFORM_LOGOS[key]
  return {
    src,
    width: size,
    height: size,
    alt: key,
    onError: (e) => {
      e.target.style.display = 'none'
    },
    className: 'rounded object-contain',
    style: { width: size, height: size },
  }
}
