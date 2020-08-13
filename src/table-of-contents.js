const SCROLL_OFFSET = 15;
const SCROLL_DURATION = 1000;

function alwaysFillParentWidth(selector) {
  const element = $(selector);

  const fillParentWidth = () => {
    const parentWidth = element.parent().width();
    element.width(parentWidth);
  }

  fillParentWidth();
  $(window).on('resize', fillParentWidth());  
}

function fillTableOfContents(tocSelector) {
  const tocTargets = $('.toc-target');
  const tocContainer = $(tocSelector);

  if (!tocTargets.length || !tocContainer.length) return;

  let tocHtml = `
    <div class="example-block">
      <h4 class="border-bottom pb-1">Table of Contents</h4>
  `;
  tocTargets.each(function(idx) {
    const isSubSection = $(this).parents('.toc-target').length;
    tocHtml += `<div class='${isSubSection ? 'toc-sub-section' : 'toc-section'} ${idx === 0 ? 'at-section' : ''}' data-target='#${$(this).attr('id')}'>
      ${$(this).data('name')}
    </div>`;
  });
  tocHtml += `</div>`;

  tocContainer.append(tocHtml);
}

function setupTableOfContentsScrolling() {
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
    });
  });
}

$(() => {
  alwaysFillParentWidth('#table-of-contents');
  fillTableOfContents('#table-of-contents');
  setupTableOfContentsScrolling();
});