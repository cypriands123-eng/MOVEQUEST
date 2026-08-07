// MOVEQUEST Common Quiz Logic
// Each quiz page sets: LESSON_NUMBER, then includes this file

const config = QUIZ_CONFIG[LESSON_NUMBER];
let currentUser = null;

function buildQuiz() {
    const form = document.getElementById("quizForm");
    let html = "";
    config.questions.forEach(function(q, i) {
        html += '<div class="question">';
        html += '<h3>' + (i + 1) + '. ' + q.label + '</h3>';
        q.options.forEach(function(opt) {
            html += '<label><input type="radio" name="' + q.entryId + '" value="' + opt + '"> ' + opt + '</label><br>';
        });
        html += '</div>';
    });
    html += '<button type="button" id="submitBtn" onclick="submitQuiz()">Submit Quiz</button>';
    form.innerHTML = html;
}

function showAlreadyPassed(score, total) {
    document.getElementById("quizForm").style.display = "none";
    const result = document.getElementById("quizResult");
    result.style.display = "block";
    document.getElementById("resultTitle").innerHTML = '<i class="fa-solid fa-circle-check" style="color:var(--success);"></i> Quiz Already Passed';
    document.getElementById("resultMessage").innerHTML = "Your score: <strong>" + score + " / " + total + "</strong><br>You have already passed this quiz.";
}

function submitQuiz() {
    const btn = document.getElementById("submitBtn");
    const result = document.getElementById("quizResult");
    const resultTitle = document.getElementById("resultTitle");
    const resultMsg = document.getElementById("resultMessage");

    const unanswered = config.questions.filter(function(q) {
        return !document.querySelector('input[name="' + q.entryId + '"]:checked');
    });
    if (unanswered.length > 0) { alert("Please answer all questions before submitting."); return; }

    btn.textContent = "Submitting...";
    btn.disabled = true;

    let score = 0;
    const total = config.questions.length;
    config.questions.forEach(function(q) {
        const selected = document.querySelector('input[name="' + q.entryId + '"]:checked');
        if (selected && selected.value === q.answer) score++;
    });

    var params = new URLSearchParams();
    config.questions.forEach(function(q) {
        var selected = document.querySelector('input[name="' + q.entryId + '"]:checked');
        if (selected) params.append(q.entryId, selected.value);
    });
    if (config.scoreEntry) params.append(config.scoreEntry, score + " / " + total);
    params.append("fvv", "1");
    params.append("pageHistory", "0");
    params.append("fbzx", Math.random().toString());

    fetch(config.formUrl, {
        method: "POST",
        body: params,
        mode: "no-cors"
    });

    markQuizCompleted(LESSON_NUMBER, score, total).then(function(res) {
        result.style.display = "block";

        if (res.passed) {
            if (score === total) {
                resultTitle.innerHTML = '<i class="fa-solid fa-star" style="color:var(--accent);"></i> Perfect Score!';
            } else {
                resultTitle.innerHTML = '<i class="fa-solid fa-check-circle" style="color:var(--success);"></i> Quiz Passed!';
            }
            const nextLesson = LESSON_NUMBER < 7 ? "Lesson " + (LESSON_NUMBER + 1) + " is now unlocked!" : "Congratulations on completing MOVEQUEST!";
            resultMsg.innerHTML = "Your score: <strong>" + score + " / " + total + "</strong><br>" + nextLesson;
            btn.textContent = "Passed";
            btn.style.background = "var(--success)";
            const redirect = LESSON_NUMBER < 7 ? "lessons.html" : "dashboard.html";
            setTimeout(function() { window.location.href = redirect; }, 3000);
        } else {
            const passing = res.passingScore;
            resultTitle.innerHTML = '<i class="fa-solid fa-circle-xmark" style="color:var(--danger);"></i> Not Passed';
            resultMsg.innerHTML = "Your score: <strong>" + score + " / " + total + "</strong><br>You need at least <strong>" + passing + "/" + total + " (75%)</strong> to pass.<br><br>You can try again!";
            btn.textContent = "Try Again";
            btn.disabled = false;
            btn.style.background = "var(--accent)";
            btn.onclick = function() { location.reload(); };
        }
    }).catch(function(error) {
        result.style.display = "block";
        resultTitle.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color:var(--danger);"></i> Error';
        resultMsg.textContent = error;
        btn.disabled = false;
        btn.textContent = "Submit Quiz";
    });
}

requireAuth().then(function(user) {
    currentUser = user;
    populateUserData(user);

    fetchUserProgress(user.uid).then(function(data) {
        if (data && data.progress && data.progress.lessons) {
            const lessonData = data.progress.lessons[LESSON_NUMBER];
            if (lessonData && lessonData.quizDone) {
                showAlreadyPassed(lessonData.score, lessonData.total);
                hideSplash();
                return;
            }
        }
        buildQuiz();
        hideSplash();
    }).catch(function() {
        buildQuiz();
        hideSplash();
    });
}).catch(function() { hideSplash(); });

document.getElementById("logoutBtn").addEventListener("click", function(e) {
    e.preventDefault();
    logoutUser();
});
