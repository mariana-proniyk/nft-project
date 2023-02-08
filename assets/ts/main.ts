function getTimeRemaining(endtime: Date) {
    const t =
        Date.parse(endtime.toISOString()) -
        Date.parse(new Date().toISOString());
    const seconds = Math.floor((t / 1000) % 60);
    const minutes = Math.floor((t / 1000 / 60) % 60);
    const hours = Math.floor((t / (1000 * 60 * 60)) % 24);

    return {
        total: t,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
    };
}

function initializeClock(id: string, endtime: Date) {
    const clock = document.getElementById(id);
    const hoursSpan = clock?.querySelector(".hours");
    const minutesSpan = clock?.querySelector(".minutes");
    const secondsSpan = clock?.querySelector(".seconds");

    function updateClock() {
        const t = getTimeRemaining(endtime);

        hoursSpan
            ? (hoursSpan.innerHTML = ("0" + t.hours).slice(-2))
            : undefined;
        minutesSpan
            ? (minutesSpan.innerHTML = ("0" + t.minutes).slice(-2))
            : undefined;
        secondsSpan
            ? (secondsSpan.innerHTML = ("0" + t.seconds).slice(-2))
            : undefined;

        if (t.total <= 0) {
            clearInterval(timeinterval);
        }
    }

    updateClock();
    const timeinterval = setInterval(updateClock, 1000);
}

const deadline = new Date(
    Date.parse(new Date().toISOString()) + 60 * 60 * 60 * 1000
);

initializeClock("clockdiv", deadline);

$(".tabs-menu li").on("click", function () {
    const tabMenuElement = $(this).parent();

    tabMenuElement.find("li").each(function () {
        $(this).removeClass("is-active");
    });

    $(this).addClass("is-active");

    tabMenuElement
        .parent()
        .find(".tab-content")
        .each(function () {
            $(this).removeClass("is-open");
        });

    $(`.${$(this).data("idTab")}`).addClass("is-open");
});

$(".main-footer form").validate({
    errorElement: "div",
    rules: {
        email: {
            required: true,
            email: true,
        },
    },
    messages: {
        email: {
            required: "We need your email address to contact you",
        },
    },
    submitHandler: function (form) {
        console.log(form, this);
    },
});

$(".account form").validate({
    errorElement: "div",
    errorPlacement: function (error, element) {
        element.parent().parent().append(error);
    },
    rules: {
        name: {
            required: true,
        },
        email: {
            required: true,
            email: true,
        },
        password: {
            required: true,
        },
        confirm: {
            required: true,
            equalTo: ".password-value",
        },
    },
    messages: {
        name: {
            required: "Please specify your name",
        },
        email: {
            required: "We need your email address to contact you",
        },
        password: {
            required: "Please enter your password",
        },
        confirm: {
            required: "Please confirm your password",
            equalTo: "Passwords should match",
        },
    },
});
