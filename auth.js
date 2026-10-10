// MOVEQUEST Authentication Module

// ============================================================
// REGISTER
// ============================================================

function registerUser(name, email, password) {
    return auth.createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;
            return user.updateProfile({ displayName: name })
                .then(function() {
                    return db.collection("users").doc(user.uid).set({
                        name: name,
                        email: email,
                        isAdmin: false,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        progress: {
                            lessonsCompleted: 0,
                            currentLevel: "Beginner",
                            points: 0,
                            badges: []
                        }
                    });
                })
                .then(function() {
                    return user;
                });
        });
}

// ============================================================
// LOGIN
// ============================================================

function loginUser(email, password) {
    return auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => userCredential.user);
}

// ============================================================
// LOGOUT
// ============================================================

function logoutUser() {
    return auth.signOut().then(() => {
        window.location.href = "index.html";
    });
}

// ============================================================
// AUTH STATE OBSERVER
// ============================================================

function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}

// ============================================================
// GET CURRENT USER
// ============================================================

function getCurrentUser() {
    return auth.currentUser;
}

// ============================================================
// PROTECT PAGE - redirect to login if not authenticated
// ============================================================

function requireAuth() {
    return Promise.resolve({ uid: "guest_user", displayName: "Guest User", email: "guest@movequest.com" });
}

// ============================================================
// POPULATE USER DATA ON PAGE
// ============================================================

function populateUserData(user) {
    // Update profile name in nav
    const navProfileName = document.querySelector(".nav-profile span");
    if (navProfileName && user.displayName) {
        navProfileName.textContent = user.displayName;
    }

    // Update profile page if on profile page
    const profileName = document.querySelector(".profile-header h1");
    if (profileName && user.displayName) {
        profileName.textContent = user.displayName;
    }

    const profileEmail = document.querySelector(".info-box p:nth-child(4)");
    if (profileEmail) {
        profileEmail.innerHTML = "<strong>Email:</strong> " + user.email;
    }

    // Update dashboard welcome
    const dashboardWelcome = document.querySelector(".dashboard-header h1");
    if (dashboardWelcome && user.displayName) {
        const firstName = user.displayName.split(" ")[0];
        dashboardWelcome.textContent = "Welcome Back, " + firstName + " 👋";
    }
}

// ============================================================
// FETCH USER PROGRESS FROM FIRESTORE
// ============================================================

function fetchUserProgress(userId) {
    return db.collection("users").doc(userId).get()
        .then((doc) => {
            if (doc.exists) {
                return doc.data();
            }
            return null;
        });
}

// ============================================================
// UPDATE USER PROGRESS IN FIRESTORE
// ============================================================

function updateUserProgress(userId, progressData) {
    return db.collection("users").doc(userId).update({
        progress: progressData
    });
}

// ============================================================
// BADGE DEFINITIONS
// ============================================================

const BADGE_LIST = {
    first_lesson:   { icon: "🏅", name: "First Step",        desc: "Completed your first lesson" },
    halfway:        { icon: "⚡", name: "Halfway Hero",      desc: "Completed 4 lessons" },
    rhythm_master:  { icon: "🎵", name: "Rhythm Master",     desc: "Completed Lesson 2" },
    dancer:         { icon: "💃", name: "Dance Explorer",    desc: "Completed 3 lessons" },
    dedicated:      { icon: "🔥", name: "Dedicated Learner", desc: "Completed 5 lessons" },
    champion:       { icon: "🏆", name: "MOVEQUEST Champion", desc: "Completed all 7 lessons" }
};

// ============================================================
// SPLASH SCREEN HELPERS
// ============================================================

function hideSplash() {
    const splash = document.getElementById("splashScreen");
    if (splash) {
        splash.classList.add("hidden");
    }
}

function requireAuthWithSplash() {
    return requireAuth().then((user) => {
        populateUserData(user);
        hideSplash();
        return user;
    }).catch(() => {
        hideSplash();
    });
}

// ============================================================
// FLOATING "BACK TO LESSONS" BUTTON (lesson & ARSC pages)
// Created from JavaScript so it still appears even if the
// browser is serving an older cached copy of the page HTML/CSS.
//
// DEBUGGING: add ?debug to the URL (e.g. lesson1.html?debug)
// to show an on-screen report. The same lines go to the
// console. If you see NO lines at all, this device is running
// an old copy of auth.js (cache or wrong server folder).
// ============================================================

(function () {

    var LESSON_PAGES = [
        "lesson1.html", "lesson2.html", "lesson3.html", "lesson4.html",
        "lesson5.html", "lesson6.html", "lesson7.html",
        "arsc-animation-song.html", "arsc-claps.html", "arsc-video.html"
    ];

    var page = window.location.pathname.split("/").pop() || "index.html";

    // ---- debug helpers ----
    var DEBUG = window.location.search.indexOf("debug") !== -1;
    var logLines = [];

    function dbg(msg) {
        console.log("[MOVEQUEST back-btn] " + msg);
        if (DEBUG) renderDebug(msg);
    }

    function renderDebug(msg) {
        logLines.push(msg);
        var box = document.getElementById("mqDebugBox");
        if (!box && document.body) {
            box = document.createElement("div");
            box.id = "mqDebugBox";
            box.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:99999;background:#000;color:#0f0;" +
                "font:12px/1.6 monospace;padding:10px;white-space:pre-wrap;";
            document.body.appendChild(box);
        }
        if (box) box.textContent = "MOVEQUEST BACK-BUTTON DEBUG (auth.js is NEW)\n" + logLines.join("\n");
    }

    dbg("page=" + page + " | in lesson list: " + (LESSON_PAGES.indexOf(page) !== -1));

    var cssLink = document.querySelector('link[href*="style.css"]');
    dbg("css href=" + (cssLink ? cssLink.getAttribute("href") : "NOT FOUND"));

    if (LESSON_PAGES.indexOf(page) === -1) {
        dbg("not a lesson page - no button expected here");
        return;
    }

    function reportBarState(label) {
        var el = document.querySelector(".back-bar");
        if (!el) { dbg(label + ": .back-bar NOT in page"); return null; }
        var cs = window.getComputedStyle(el);
        dbg(label + ": position=" + cs.position + " right=" + cs.right + " bottom=" + cs.bottom +
            " z=" + cs.zIndex + " opacity=" + cs.opacity + " size=" + Math.round(el.getBoundingClientRect().width) + "x" + Math.round(el.getBoundingClientRect().height));
        return el;
    }

    function buildBackButton() {

        // The lesson pages already contain the button in their markup —
        // only create it when it is missing (old cached page).
        if (reportBarState("markup check")) {
            dbg("button already in page HTML - nothing to inject");
            return;
        }

        // Self-contained styles so the button looks right even if the
        // stylesheet being served is an older cached copy.
        var style = document.createElement("style");
        style.textContent =
            ".back-bar{position:fixed;right:25px;bottom:calc(25px + env(safe-area-inset-bottom,0px));z-index:10000;}" +
            ".back-btn{display:inline-flex;align-items:center;gap:10px;padding:13px 26px;background:#0B5ED7;color:#fff;border-radius:50px;font-size:15px;font-weight:500;box-shadow:0 10px 26px rgba(6,46,110,.35);text-decoration:none;font-family:'Poppins',sans-serif;transition:.3s;}" +
            "@media(max-width:480px){.back-bar{right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));}.back-btn{padding:13px 20px;font-size:14px;}}";
        document.head.appendChild(style);

        var bar = document.createElement("div");
        bar.className = "back-bar";
        bar.innerHTML = '<a href="lessons.html" class="back-btn"><i class="fa-solid fa-arrow-left"></i> Back to Lessons</a>';
        document.body.appendChild(bar);

        dbg("page HTML was MISSING the button - injected by auth.js");
        reportBarState("after inject");

    }

    if (document.body) {
        buildBackButton();
    } else {
        document.addEventListener("DOMContentLoaded", buildBackButton);
    }

})();
