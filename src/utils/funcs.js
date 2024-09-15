export function isDesktop() {                          // 判断是否为桌面设备
    let userAgent = navigator.userAgent.toLowerCase();
    let isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent);
    return !isMobile;
}