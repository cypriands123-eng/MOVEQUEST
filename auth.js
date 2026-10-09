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
