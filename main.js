var striptease = {};

$.getJSON(
	"https://tdsjsext3.com/ExtService.svc/getextparams",
	function (data) {
		if (data.city.en) {
			$('#title').text('Looking for hot hookups tonight in ' + data.city.en + '?');
		}

		if (data.city.de) {
			$('#titleDE').text('Möchtest du heute Abend in ' + data.city.de + ' flirten?');
		}

		if (data.city.ru) {
			$('#title-ru').text('Ищешь с кем заняться сексом сегодня в г. ' + data.city.ru + '?');
		}
	});

jQuery(document).ready(function () {
	if (jQuery(".slide").length > 0) {
		striptease.Init();
	}
	if ($("input[name=__RequestVerificationToken]").length > 0) {
		var antiforgeryToken = $("input[name=__RequestVerificationToken]").val();
		$("input[name=__RequestVerificationToken]").val(antiforgeryToken);
	}
});

(function ($) {
	striptease = {
		TotalSlides: 0,
		CurrentSlide: 1,
		Answers: [],
		Percentage: 0,
		PercentageText: "",
		Init: function () {
			striptease.TotalSlides = $(".slide").length;

			$(".answer_clicked").unbind("click");
			$(".answer_clicked").bind("click", function () {
				striptease.Events.AnswerClicked();
			});

			$(".answer_changed").unbind("changed");
			$(".answer_changed").change(function () {
				striptease.Events.AnswerChanged();
			});

			$(".slide_next, .bubble").unbind("click");
			$(".slide_next, .bubble").bind("click", function () {
				striptease.Events.NextButtonClicked();
			});

			$(".slide_previous").unbind("click");
			$(".slide_previous").bind("click", function () {
				striptease.Events.PreviousButtonClicked();
			});

			/*$('.button, .slide_next, .slide_previous, .bubble').click(function () {
				$('html, body').animate({ scrollTop: $("#top").offset().top + 1 }, 400);
			});*/

			//set countdown timer
			if ($('.clock').length > 0) {
				if ($('#startCountdown').length > 0) {
					//start on element click
					$('#startCountdown').click(function () {
						striptease.Functions.SetClockInterval();
					});
				} else {
					//start on page load
					striptease.Functions.SetClockInterval();
				}

				$(".showclock").click(function () {
					$(".clock-container").show();
				});

				$('.hideclock').on("click.clock", function () {
					$('.clock-container').hide();
				});

				$('.hideh1').on("click.clock", function () {
					$('.h1').hide();
				});
			}

			//Setup first slde
			striptease.Functions.DisablePreviousButton();
			striptease.Functions.FadeInNewSlide();
		},

		Functions:
		{
			NextButtonExistInCurrentSlide: function () {
				var slideNextButton = $("#slide" + striptease.CurrentSlide).find(".slide_next");
				if (slideNextButton.length > 0)
					return true;
				return false;
			},

			EnableNextButton: function () {
				$(".slide_next").show();
				$(".slide_next").prop('disabled', false);
			},

			DisableNextButton: function () {
				$(".slide_next").prop('disabled', true);
				$(".slide_next").hide();
			},

			EnablePreviousButton: function () {
				$(".slide_previous").show();
				$(".slide_previous").prop('disabled', false);
			},

			DisablePreviousButton: function () {
				$(".slide_previous").prop('disabled', true);
				$(".slide_previous").hide();
			},

			SetRightPercentage: function () {
				if (jQuery(".percentage_wrapper").length !== 0) {
					striptease.Percentage = (striptease.CurrentSlide / striptease.TotalSlides) * 80 + 20;
					striptease.PercentageText = Math.round(striptease.Percentage) + "%"
					jQuery(".percentage_done").css({ 'width': striptease.PercentageText });
					jQuery(".percentage_text").html(striptease.PercentageText);
				}
			},

			NextSlideIsAvailable: function () {
				return (striptease.CurrentSlide + 1) <= striptease.TotalSlides;
			},

			PreviousSlideIsAvailable: function () {
				return (striptease.CurrentSlide - 1) >= 1;
			},

			FadeInNewSlide: function () {
				striptease.Functions.SetRightPercentage();
				striptease.Functions.FadeInCurrentSlide();
			},

			FadeOutCurrentSlide: function () {
				$("#slide" + striptease.CurrentSlide).hide();
			},

			FadeInCurrentSlide: function () {
				$("#slide" + striptease.CurrentSlide).show();
			},

			GotoNextSlide: function () {
				if (striptease.Functions.NextSlideIsAvailable()) {
					striptease.Functions.FadeOutCurrentSlide();
					striptease.CurrentSlide++;
					striptease.Functions.DisableNextButton();
					striptease.Functions.DisablePreviousButton();
					striptease.Functions.EnableNextButton();
					striptease.Functions.FadeInNewSlide();
					if (striptease.Functions.PreviousSlideIsAvailable())
						striptease.Functions.EnablePreviousButton();
				}
			},

			GotoPreviousSlide: function () {
				if (striptease.CurrentSlide - 1 >= 1) {
					striptease.Functions.FadeOutCurrentSlide();
					striptease.CurrentSlide--;
					striptease.Functions.DisableNextButton();
					striptease.Functions.DisablePreviousButton();
					striptease.Functions.EnableNextButton();
					striptease.Functions.FadeInNewSlide();
				}
				if (striptease.Functions.PreviousSlideIsAvailable()) {
					striptease.Functions.EnablePreviousButton();
				}
			},

			SetClockInterval: function () {
				var interval = setInterval(function () {
					var timer = $('.clock').html();
					timer = timer.split(':');
					var minutes = parseInt(timer[0], 10);
					var seconds = parseInt(timer[1], 10);
					seconds -= 1;
					if (minutes < 0) return clearInterval(interval);
					if (minutes < 10 && minutes.length != 2) minutes = '0' + minutes;
					if (seconds < 0 && minutes != 0) {
						minutes -= 1;
						seconds = 59;
					} else if (seconds < 10 && length.seconds != 2) seconds = '0' + seconds;
					$('.clock').html(minutes + ':' + seconds);
					// Add warning color and blink
					if (minutes == 0 && seconds <= 30) {
						setInterval(function () {
							$(".clock").fadeToggle();
						}, 500);
						$('.clock').addClass("warning");
					};
					if (minutes == 0 && seconds == 0) {
						clearInterval(interval);
					};
				}, 1000);
			}
		},
		Events: {

			NextButtonClicked: function () {
				striptease.Functions.GotoNextSlide();
			},

			//Triggered when the user navigates to the previous question.
			PreviousButtonClicked: function () {
				striptease.Functions.GotoPreviousSlide();
			},

			//Some questions consist of multiple buttons to press (such as colour of eyes).
			//Pressing one of these triggers this function. The answer is collected, validated
			//stored, and lastly the next question is shown.
			AnswerClicked: function () {
				if (striptease.Functions.NextButtonExistInCurrentSlide() === false) {
					striptease.Functions.GotoNextSlide();
				}
				else {
					striptease.Functions.EnableNextButton();
				}

			},

			//Some questions consist of a select box. When an answer is selected in one,
			//this method is triggered.
			AnswerChanged: function () {
				if (striptease.Functions.NextButtonExistInCurrentSlide() === false) {
					striptease.Functions.GotoNextSlide();
				}
				else {
					striptease.Functions.EnableNextButton();
				}

			}
		}

	}
})(jQuery);