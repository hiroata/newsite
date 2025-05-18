/**
 * フッターのホバーエフェクト強化
 */
document.addEventListener('DOMContentLoaded', function() {
  // jQuery不使用のピュアJavaScriptでエフェクトを付ける
  // 右からインサート用のエフェクト（footer-widget-3）
  const widget3Links = document.querySelectorAll('.footer-widget-3 ul li a');
  widget3Links.forEach(link => {
    link.innerHTML = '→ ' + link.innerHTML;
    link.style.paddingLeft = '0';
    link.style.transform = 'translateX(0)';
    link.style.transition = 'all 0.075s ease-out';
    
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateX(8px)';
      link.style.paddingLeft = '5px';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateX(0)';
      link.style.paddingLeft = '0';
    });
  });
  // 左からインサート用のエフェクト（footer-widget-4）
  const widget4Links = document.querySelectorAll('.footer-widget-4 ul li a');
  widget4Links.forEach(link => {
    link.innerHTML = link.innerHTML + ' ←';
    link.style.paddingRight = '0';
    link.style.transform = 'translateX(0)';
    link.style.transition = 'all 0.075s ease-out';
    
    link.addEventListener('mouseenter', () => {
      link.style.transform = 'translateX(-8px)';
      link.style.paddingRight = '5px';
    });
    
    link.addEventListener('mouseleave', () => {
      link.style.transform = 'translateX(0)';
      link.style.paddingRight = '0';
    });
  });
});
