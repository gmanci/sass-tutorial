$(document).ready(function () {
    if ($(window).width() > 767) {
        $(window).scroll(function() {
            var winOffset = window.pageYOffset;
            var height = $(".header").height();
            var brightness = ((height - winOffset) / height * 80) + 20;
            var blur = (1 - ((height - winOffset) / height)) * 5;
            var filter = 'brightness(' + brightness +'%) blur(' + blur + 'px)';
            var elem = $(".header");
            elem.css("webkitFilter", filter);
            elem.css("filter", filter);
        });
        $(document).resize(function () {
            var winOffset = window.pageYOffset;
            var height = $(".header").height();
            var brightness = ((height - winOffset) / height * 80) + 20;
            var blur = (1 - ((height - winOffset) / height)) * 5;
            var filter = 'brightness(' + brightness +'%) blur(' + blur + 'px)';
            var elem = $(".header");
            elem.css("webkitFilter", filter);
            elem.css("filter", filter);
        });
    }
});
