// MOVEQUEST Quiz Configuration
// Each quiz has: formUrl, emailEntry, scoreEntry (optional), and questions array
// questions: [{ entryId, label, options: [...], answer: "Correct Option" }]

const QUIZ_CONFIG = {
    1: {
        formUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfm2fS6iHcDo-7bOJKLDc09YPrzr3XiabcG_VTuAZhfxTsbAA/formResponse", 
        emailEntry: "entry.1609859999",
        scoreEntry: null, // set to an entry ID if your form has a score field
        questions: [
            { entryId: "entry.561153732", label: "Answer is option 2", options: ["Option 1", "Option 2", "Option 3", "Option 4"], answer: "Option 2" },
            { entryId: "entry.1853079539", label: "answer opt 1", options: ["Option 1", "Option 2", "Option 3", "Option 4"], answer: "Option 1" }
        ]
    },
    2: {
        formUrl: "https://docs.google.com/forms/d/e/1FAIpQLScreFJrZILSiXY1wxjAgUUb7njf3vkwpVywM5FfSy0R5LQffA /formResponse",
        emailEntry: "entry.1975297750",
        scoreEntry: null,
        questions: [
            { entryId: "entry.1117202828", label: "What is rhythm in dance?", options: ["Moving according to the beat of music", "Creating dance costumes", "Jumping as high as possible", "Dancing without music"], answer: "Moving according to the beat of music" },
            { entryId: "entry.371305038", label: "What does musicality help a dancer express?", options: ["Only speed", "Emotions and movement", "Dance costumes", "Competition scores"], answer: "Emotions and movement" },
            { entryId: "entry.1599973541", label: "Which of the following is an important part of musicality?", options: ["Tempo", "Hair style", "Dance shoes", "Stage lights"], answer: "Tempo" },
            { entryId: "entry.960362744", label: "What should you do before you start dancing?", options: ["Listen carefully to the music", "Close your eyes", "Run around the room", "Memorize every step immediately"], answer: "Listen carefully to the music" },
            { entryId: "entry.1966492381", label: "In the practice activity, what numbers do you repeatedly count?", options: ["1–4", "1–6", "1–8", "1–10"], answer: "1–8" },
            { entryId: "entry.680972735", label: "Which learning objective focuses on matching movement with music?", options: ["Synchronize movements with music", "Design dance costumes", "Increase jumping height", "Memorize lyrics"], answer: "Synchronize movements with music" },
            { entryId: "entry.469518681", label: "What is the purpose of counting the beat while dancing?", options: ["To stay on time with the music", "To finish the dance faster", "To make the music louder", "To avoid moving"], answer: "To stay on time with the music" },
            { entryId: "entry.1054049150", label: "Which of the following best describes a steady beat?", options: ["A regular and consistent pulse in music", "Random sounds", "Fast movements only", "Silence between songs"], answer: "A regular and consistent pulse in music" },
            { entryId: "entry.365955092", label: "According to the lesson, dancers should ______ the music instead of simply memorizing the steps.", options: ["Feel", "Ignore", "Stop", "Change"], answer: "Feel" },
            { entryId: "entry.1599778405", label: "How does rhythm improve dancing?", options: ["It improves confidence and coordination", "It changes the music", "It makes costumes colorful", "It removes the need for practice"], answer: "It improves confidence and coordination" }
        ]
    },
    3: {
        formUrl: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
        emailEntry: "entry.XXXXXXXXXX",
        scoreEntry: null,
        questions: [
            { entryId: "entry.XXXXXXXXXX", label: "Question 1?", options: ["A", "B", "C"], answer: "B" }
        ]
    },
    4: {
        formUrl: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
        emailEntry: "entry.XXXXXXXXXX",
        scoreEntry: null,
        questions: [
            { entryId: "entry.XXXXXXXXXX", label: "Question 1?", options: ["A", "B", "C"], answer: "B" }
        ]
    },
    5: {
        formUrl: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
        emailEntry: "entry.XXXXXXXXXX",
        scoreEntry: null,
        questions: [
            { entryId: "entry.XXXXXXXXXX", label: "Question 1?", options: ["A", "B", "C"], answer: "B" }
        ]
    },
    6: {
        formUrl: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
        emailEntry: "entry.XXXXXXXXXX",
        scoreEntry: null,
        questions: [
            { entryId: "entry.XXXXXXXXXX", label: "Question 1?", options: ["A", "B", "C"], answer: "B" }
        ]
    },
    7: {
        formUrl: "https://docs.google.com/forms/d/e/FORM_ID/formResponse",
        emailEntry: "entry.XXXXXXXXXX",
        scoreEntry: null,
        questions: [
            { entryId: "entry.XXXXXXXXXX", label: "Question 1?", options: ["A", "B", "C"], answer: "B" }
        ]
    }
};
