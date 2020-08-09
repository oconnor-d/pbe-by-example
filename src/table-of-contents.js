const SCROLL_OFFSET = 15;
const SCROLL_DURATION = 1000;

$(() => {
  const navbarHeight = $('.navbar').height();
  const goToSection = sectionId => () => {
    $('html, body').stop();
    
    const sectionPosition = $(sectionId).offset().top - navbarHeight - SCROLL_OFFSET;
    $('html, body').animate({
      scrollTop: sectionPosition
    }, SCROLL_DURATION);
  };

  const tocSections = $('.toc-section, .toc-sub-section');
  tocSections.each(function() {
    const tocSection = $(this);
    tocSection.on('click', goToSection(tocSection.data('target')));
  });
});