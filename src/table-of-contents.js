const SCROLL_OFFSET = 15;
const SCROLL_DURATION = 1000;

$(() => {
  const tocSections = $('.toc-section, .toc-sub-section');
  let isScrollingToSection = false;

  const setCurrentSection = tocSection => {
    $(tocSections).removeClass('at-section');
    $(tocSection).addClass('at-section');
  }

  const navbarHeight = $('.navbar').height();
  const goToSection = tocSection => () => {
    $('html, body').stop();

    isScrollingToSection = true;

    const sectionPosition = $(tocSection.data('target')).offset().top - navbarHeight - SCROLL_OFFSET;
    $('html, body').animate({
      scrollTop: sectionPosition
    }, SCROLL_DURATION, () => { isScrollingToSection = false });

    setCurrentSection(tocSection);
  };

  tocSections.each(function() {
    const tocSection = $(this);
    tocSection.on('click', goToSection(tocSection));
  });

  const atOrPastSection = sectionId => {
    const pageTop = $(window).scrollTop() + navbarHeight;
    const elementTop = $(sectionId).offset().top;

    return elementTop < pageTop;
  }

  $(window).scroll(function() {
    if (isScrollingToSection) return;

    tocSections.each(function () {
      if (atOrPastSection($(this).data('target'))) {
        setCurrentSection(this);
      }
    })
  });
});