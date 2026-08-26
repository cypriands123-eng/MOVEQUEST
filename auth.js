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
                            quizzesPassed: 0,
                            currentLevel: "Beginner",
                            points: 0,
                            badges: [],
                            lessons: {
                                1: { quizDone: false, score: 0, total: 0 },
                                2: { quizDone: false, score: 0, total: 0 },
                                3: { quizDone: false, score: 0, total: 0 },
                                4: { quizDone: false, score: 0, total: 0 },
                                5: { quizDone: false, score: 0, total: 0 },
                                6: { quizDone: false, score: 0, total: 0 },
                                7: { quizDone: false, score: 0, total: 0 }
                            }
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
    return new Promise((resolve, reject) => {
        const unsubscribe = onAuthStateChanged((user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                window.location.href = "login.html";
                reject("Not authenticated");
            }
        });
    });
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
    quiz_whiz:      { icon: "📝", name: "Quiz Whiz",         desc: "Passed your first quiz" },
    halfway:        { icon: "⚡", name: "Halfway Hero",      desc: "Completed 4 lessons" },
    rhythm_master:  { icon: "🎵", name: "Rhythm Master",     desc: "Completed Lesson 2" },
    dancer:         { icon: "💃", name: "Dance Explorer",    desc: "Completed 3 lessons" },
    dedicated:      { icon: "🔥", name: "Dedicated Learner", desc: "Completed 5 lessons" },
    all_quizzes:    { icon: "✅", name: "Quiz Champion",     desc: "Passed all 7 quizzes" },
    champion:       { icon: "🏆", name: "MOVEQUEST Champion", desc: "Completed all 7 lessons" }
};

// ============================================================
// MARK QUIZ COMPLETED
// ============================================================

function markQuizCompleted(lessonNumber, score, totalQuestions) {
    const user = auth.currentUser;
    if (!user) return Promise.reject("Not logged in");

    score = score || 0;
    totalQuestions = totalQuestions || 0;
    const passingScore = Math.ceil(totalQuestions * 0.75);

    const userRef = db.collection("users").doc(user.uid);

    return userRef.get().then((doc) => {
        if (!doc.exists) {
            return userRef.set({
                name: user.displayName || "",
                email: user.email,
                isAdmin: false,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                progress: {
                    lessonsCompleted: 0,
                    quizzesPassed: 0,
                    currentLevel: "Beginner",
                    points: 0,
                    badges: [],
                    lessons: {
                        1: { quizDone: false, score: 0, total: 0 },
                        2: { quizDone: false, score: 0, total: 0 },
                        3: { quizDone: false, score: 0, total: 0 },
                        4: { quizDone: false, score: 0, total: 0 },
                        5: { quizDone: false, score: 0, total: 0 },
                        6: { quizDone: false, score: 0, total: 0 },
                        7: { quizDone: false, score: 0, total: 0 }
                    }
                }
            }).then(function() {
                return userRef.get();
            });
        }
        return doc;
    }).then((doc) => {
        const data = doc.data();
        const progress = data.progress || {};
        const completed = progress.lessonsCompleted || 0;
        const lessons = progress.lessons || {};

        // Ensure all lesson entries exist
        for (let i = 1; i <= 7; i++) {
            if (!lessons[i]) {
                lessons[i] = { quizDone: false, score: 0, total: 0 };
            }
        }

        // Check if already passed
        if (lessons[lessonNumber] && lessons[lessonNumber].quizDone) {
            return { passed: true, alreadyDone: true, score: score, total: totalQuestions };
        }

        // Save the attempt score regardless of pass/fail
        lessons[lessonNumber] = {
            quizDone: false,
            score: score,
            total: totalQuestions
        };

        // Check if passed (>= 75%)
        if (score < passingScore) {
            // Failed - save score but don't unlock next lesson
            return userRef.update({
                progress: {
                    lessonsCompleted: completed,
                    quizzesPassed: progress.quizzesPassed || 0,
                    currentLevel: progress.currentLevel || "Beginner",
                    points: progress.points || 0,
                    badges: progress.badges || [],
                    lessons: lessons
                }
            }).then(() => {
                return { passed: false, score: score, total: totalQuestions, passingScore: passingScore };
            });
        }

        // Passed - unlock next lesson
        if (lessonNumber === completed + 1) {
            const newCompleted = completed + 1;
            const newQuizzes = (progress.quizzesPassed || 0) + 1;
            let points = (progress.points || 0) + (score * 10);
            let badges = progress.badges ? [...progress.badges] : [];

            lessons[lessonNumber] = {
                quizDone: true,
                score: score,
                total: totalQuestions
            };

            function addBadge(id) {
                if (!badges.includes(id)) badges.push(id);
            }

            addBadge("quiz_whiz");
            if (lessonNumber === 1) addBadge("first_lesson");
            if (lessonNumber === 2) addBadge("rhythm_master");
            if (newCompleted >= 3) addBadge("dancer");
            if (newCompleted >= 4) addBadge("halfway");
            if (newCompleted >= 5) addBadge("dedicated");
            if (newQuizzes >= 7) addBadge("all_quizzes");
            if (newCompleted >= 7) {
                addBadge("champion");
                points += 200;
            }

            let level = "Beginner";
            if (newCompleted >= 4) level = "Intermediate";
            if (newCompleted >= 7) level = "Advanced";

            return userRef.update({
                progress: {
                    lessonsCompleted: newCompleted,
                    quizzesPassed: newQuizzes,
                    currentLevel: level,
                    points: points,
                    badges: badges,
                    lessons: lessons
                }
            }).then(() => {
                return { passed: true, score: score, total: totalQuestions };
            });
        }
    });
}

// ============================================================
// MARK VIDEO LESSON COMPLETED (Lessons 6 & 7)
// ============================================================

function markVideoCompleted(lessonNumber) {
    const user = auth.currentUser;
    if (!user) return Promise.reject("Not logged in");

    const userRef = db.collection("users").doc(user.uid);

    return userRef.get().then((doc) => {
        if (!doc.exists) return null;

        const data = doc.data();
        const progress = data.progress || {};
        const completed = progress.lessonsCompleted || 0;
        const lessons = progress.lessons || {};

        // Ensure lesson entry exists
        if (!lessons[lessonNumber]) {
            lessons[lessonNumber] = { quizDone: false, score: 0, total: 0 };
        }

        // Already completed
        if (lessons[lessonNumber].quizDone) {
            return { alreadyDone: true };
        }

        // Only complete if previous lessons are done
        if (lessonNumber !== completed + 1) {
            return { alreadyDone: false, skipped: true };
        }

        const newCompleted = completed + 1;
        let points = (progress.points || 0) + 100;
        let badges = progress.badges ? [...progress.badges] : [];

        lessons[lessonNumber] = {
            quizDone: true,
            score: 1,
            total: 1
        };

        function addBadge(id) {
            if (!badges.includes(id)) badges.push(id);
        }

        addBadge("quiz_whiz");
        if (newCompleted >= 3) addBadge("dancer");
        if (newCompleted >= 4) addBadge("halfway");
        if (newCompleted >= 5) addBadge("dedicated");
        if (newCompleted >= 7) {
            addBadge("champion");
            addBadge("all_quizzes");
            points += 200;
        }

        let level = "Beginner";
        if (newCompleted >= 4) level = "Intermediate";
        if (newCompleted >= 7) level = "Advanced";

        return userRef.update({
            progress: {
                lessonsCompleted: newCompleted,
                quizzesPassed: (progress.quizzesPassed || 0) + 1,
                currentLevel: level,
                points: points,
                badges: badges,
                lessons: lessons
            }
        }).then(() => {
            return { completed: true };
        });
    });
}

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
