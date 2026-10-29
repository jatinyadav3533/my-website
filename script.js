/* ==========================================================================
   SPARKLET - script.js
   JavaScript provides the interactive functionality of the web page.
   
   How it works:
     1. Global State Variables: Store user points, streak, and daily counts.
     2. Functions: Perform actions when buttons are clicked (e.g., adding water,
        calculating calories, grading the quiz).
     3. DOM Manipulation: Uses "document.getElementById()" to update the HTML
        text and styles dynamically on the screen.
   ========================================================================== */


/* ==========================================================================
   1. GLOBAL VARIABLES (Application State)
   These variables remember information while the webpage is open.
   ========================================================================== */
var streak = 4;           // Current consecutive days streak
var xp = 120;             // Experience Points earned by the user
var waterCount = 3;       // Number of water glasses drunk today (out of 8)
var moveCompleted = false;// Tracks if morning movement task is finished
var mealCompleted = false;// Tracks if healthy fruit/meal task is finished
var quizCompleted = false;// Tracks if health quiz is completed


/* ==========================================================================
   2. TOAST NOTIFICATION HELPER
   Shows a temporary floating message at the bottom of the screen.
   ========================================================================== */
var toastTimer = null;

function showToast(message) {
  var toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");

  // Automatically hide the toast after 2.5 seconds (2500 milliseconds)
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    toast.classList.remove("show");
  }, 2500);
}


/* ==========================================================================
   3. HYDRATION TRACKER FUNCTIONS (Add & Remove Water)
   ========================================================================== */
function addWater() {
  if (waterCount < 8) {
    waterCount = waterCount + 1;
    xp = xp + 5; // Reward 5 XP for drinking water
    
    // Update the HTML display
    document.getElementById("waterCount").textContent = waterCount;
    document.getElementById("xpCount").textContent = xp;
    
    showToast("💧 Great job! Glass added (+5 XP)");

    // If user reaches 8 glasses, unlock the Hydration badge
    if (waterCount === 8) {
      unlockBadge("badgeWater", "badgeWaterTag", "Unlocked ✓");
      showToast("🎉 Awesome! You reached your 8-glass goal! (+20 XP)");
      xp = xp + 20;
      document.getElementById("xpCount").textContent = xp;
    }
  } else {
    showToast("💧 Daily hydration goal of 8 glasses already reached!");
  }

  updateDailyProgress();
}

function removeWater() {
  if (waterCount > 0) {
    waterCount = waterCount - 1;
    document.getElementById("waterCount").textContent = waterCount;
    showToast("Water glass removed");
    updateDailyProgress();
  }
}


/* ==========================================================================
   4. HABIT COMPLETION FUNCTIONS (Movement & Meal)
   ========================================================================== */
function completeMoveTask() {
  if (!moveCompleted) {
    moveCompleted = true;
    xp = xp + 15; // Award 15 points
    
    // Update badge status to "Completed"
    var statusSpan = document.getElementById("moveStatus");
    statusSpan.textContent = "Completed ✓";
    statusSpan.className = "status-badge completed";
    
    // Disable the button and show done text
    var btn = document.getElementById("moveBtn");
    btn.textContent = "Done ✓";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "default";

    document.getElementById("xpCount").textContent = xp;
    showToast("🏃 Morning Movement completed! (+15 XP)");

    // Unlock move badge
    unlockBadge("badgeMove", "badgeMoveTag", "Unlocked ✓");
    updateDailyProgress();
  }
}

function completeMealTask() {
  if (!mealCompleted) {
    mealCompleted = true;
    xp = xp + 15; // Award 15 points
    
    var statusSpan = document.getElementById("mealStatus");
    statusSpan.textContent = "Completed ✓";
    statusSpan.className = "status-badge completed";
    
    var btn = document.getElementById("mealBtn");
    btn.textContent = "Done ✓";
    btn.disabled = true;
    btn.style.opacity = "0.7";
    btn.style.cursor = "default";

    document.getElementById("xpCount").textContent = xp;
    showToast("🥗 Healthy Food logged! (+15 XP)");
    updateDailyProgress();
  }
}


/* ==========================================================================
   5. WORKOUT ROUTINE COMPLETION
   ========================================================================== */
function completeWorkout(workoutName) {
  xp = xp + 20; // Award 20 points
  document.getElementById("xpCount").textContent = xp;
  showToast("💪 " + workoutName + " completed! (+20 XP)");
  
  // Also unlocks the Move Master badge
  unlockBadge("badgeMove", "badgeMoveTag", "Unlocked ✓");
}


/* ==========================================================================
   6. DIET PLAN TOGGLE (Vegetarian vs Non-Vegetarian)
   Switches between the two HTML tables using style.display
   ========================================================================== */
function showDiet(type) {
  var vegTable = document.getElementById("vegTable");
  var nonVegTable = document.getElementById("nonVegTable");
  var btnVeg = document.getElementById("btnVeg");
  var btnNonVeg = document.getElementById("btnNonVeg");

  if (type === "veg") {
    // Show vegetarian table, hide non-veg table
    vegTable.style.display = "block";
    nonVegTable.style.display = "none";
    btnVeg.classList.add("active");
    btnNonVeg.classList.remove("active");
  } else {
    // Show non-vegetarian table, hide veg table
    vegTable.style.display = "none";
    nonVegTable.style.display = "block";
    btnNonVeg.classList.add("active");
    btnVeg.classList.remove("active");
  }
}


/* ==========================================================================
   7. FOOD CALORIE & NUTRITION CALCULATOR
   Uses a clean JavaScript dictionary (object) of foods and multiplies by quantity.
   ========================================================================== */
var foodDatabase = {
  apple: {
    name: "Apple",
    calories: 95,
    protein: 0.5,
    carbs: 25,
    tip: "Apples are rich in dietary fiber and Vitamin C. Great for gut health and a quick study snack!"
  },
  banana: {
    name: "Banana",
    calories: 105,
    protein: 1.3,
    carbs: 27,
    tip: "Bananas provide quick potassium and healthy carbohydrates for instant physical and mental energy."
  },
  egg: {
    name: "Boiled Egg",
    calories: 78,
    protein: 6.3,
    carbs: 0.6,
    tip: "Eggs contain complete high-quality protein and choline, which supports brain memory function."
  },
  roti: {
    name: "Whole Wheat Roti",
    calories: 100,
    protein: 3.2,
    carbs: 20,
    tip: "Whole wheat rotis provide complex carbs and B-vitamins that keep hunger away for hours."
  },
  rice: {
    name: "Cooked Rice",
    calories: 200,
    protein: 4.3,
    carbs: 45,
    tip: "Easy to digest and pairs great with dal or grilled chicken for balanced post-study refueling."
  },
  dal: {
    name: "Dal / Lentils",
    calories: 180,
    protein: 9.0,
    carbs: 30,
    tip: "Lentils are an outstanding source of plant protein, iron, and gut-friendly prebiotic fiber."
  },
  paneer: {
    name: "Paneer",
    calories: 265,
    protein: 18.0,
    carbs: 3.5,
    tip: "Rich in calcium and slow-digesting casein protein, ideal for strengthening bones and muscles."
  },
  chicken: {
    name: "Chicken Breast",
    calories: 165,
    protein: 31.0,
    carbs: 0.0,
    tip: "One of the leanest sources of pure protein. Excellent for tissue repair and fitness recovery."
  },
  milk: {
    name: "Milk",
    calories: 150,
    protein: 8.0,
    carbs: 12.0,
    tip: "Provides calcium, vitamin D, and hydration. Warm milk at night promotes deeper restful sleep."
  },
  salad: {
    name: "Mixed Salad",
    calories: 50,
    protein: 2.0,
    carbs: 10.0,
    tip: "Super low in calories and packed with antioxidants, keeping skin healthy and immune system strong."
  },
  almonds: {
    name: "Almonds",
    calories: 70,
    protein: 2.5,
    carbs: 2.5,
    tip: "Rich in vitamin E and healthy mono-unsaturated fats that nourish brain concentration."
  }
};

function calculateCalories() {
  // Read selected food key from the dropdown
  var selectedKey = document.getElementById("foodSelect").value;
  
  // Read quantity input (default to 1 if empty or less than 1)
  var quantity = parseInt(document.getElementById("foodQuantity").value);
  if (isNaN(quantity) || quantity < 1) {
    quantity = 1;
  }

  // Look up food item in our foodDatabase object
  var food = foodDatabase[selectedKey];

  if (food) {
    // Multiply values by quantity
    var totalCalories = Math.round(food.calories * quantity);
    var totalProtein = (food.protein * quantity).toFixed(1);
    var totalCarbs = (food.carbs * quantity).toFixed(1);

    // Update the numbers in the HTML result card
    document.getElementById("resCalories").textContent = totalCalories;
    document.getElementById("resProtein").textContent = totalProtein + "g";
    document.getElementById("resCarbs").textContent = totalCarbs + "g";
    
    // Update the tip box
    document.getElementById("resTip").innerHTML = "💡 <strong>Tip:</strong> " + food.tip;
  }
}


/* ==========================================================================
   8. HEALTH QUIZ EVALUATION
   Reads selected radio inputs, checks correct answers, and computes score.
   ========================================================================== */
function checkQuiz() {
  // Correct answers: Q1 -> B (8-10 glasses), Q2 -> A (Protein), Q3 -> B (Stretch break)
  var score = 0;

  // Question 1 check
  var q1Options = document.getElementsByName("q1");
  var q1Answer = "";
  for (var i = 0; i < q1Options.length; i++) {
    if (q1Options[i].checked) {
      q1Answer = q1Options[i].value;
      break;
    }
  }

  // Question 2 check
  var q2Options = document.getElementsByName("q2");
  var q2Answer = "";
  for (var j = 0; j < q2Options.length; j++) {
    if (q2Options[j].checked) {
      q2Answer = q2Options[j].value;
      break;
    }
  }

  // Question 3 check
  var q3Options = document.getElementsByName("q3");
  var q3Answer = "";
  for (var k = 0; k < q3Options.length; k++) {
    if (q3Options[k].checked) {
      q3Answer = q3Options[k].value;
      break;
    }
  }

  // Validate that user answered all questions
  if (q1Answer === "" || q2Answer === "" || q3Answer === "") {
    var feedbackBox = document.getElementById("quizFeedback");
    feedbackBox.style.display = "block";
    feedbackBox.className = "quiz-feedback warning";
    feedbackBox.innerHTML = "⚠️ Please select an answer for all 3 questions before submitting!";
    return;
  }

  // Calculate score
  if (q1Answer === "B") { score = score + 1; }
  if (q2Answer === "A") { score = score + 1; }
  if (q3Answer === "B") { score = score + 1; }

  // Display feedback message
  var feedback = document.getElementById("quizFeedback");
  feedback.style.display = "block";

  if (score === 3) {
    feedback.className = "quiz-feedback success";
    feedback.innerHTML = "🎉 <strong>Perfect Score: 3 / 3!</strong> Excellent health knowledge. You earned +30 XP!";
    
    if (!quizCompleted) {
      quizCompleted = true;
      xp = xp + 30;
      document.getElementById("xpCount").textContent = xp;
      unlockBadge("badgeQuiz", "badgeQuizTag", "Unlocked ✓");
    }
  } else {
    feedback.className = "quiz-feedback warning";
    feedback.innerHTML = "👍 <strong>You scored " + score + " / 3!</strong> Good effort. Review the questions and try again to get full marks!";
  }
}

function resetQuiz() {
  var feedback = document.getElementById("quizFeedback");
  feedback.style.display = "none";
}


/* ==========================================================================
   9. BADGES & OVERALL DAILY PROGRESS
   ========================================================================== */
function unlockBadge(badgeCardId, badgeTagId, text) {
  var card = document.getElementById(badgeCardId);
  var tag = document.getElementById(badgeTagId);
  if (card && tag) {
    card.classList.add("unlocked");
    tag.textContent = text;
    tag.classList.add("status-done");
  }
}

function updateDailyProgress() {
  // Count how many of the 3 daily tasks are done:
  // 1. Water reached at least 6 glasses
  // 2. Move task completed
  // 3. Meal task completed
  var completedCount = 0;
  if (waterCount >= 6) { completedCount = completedCount + 1; }
  if (moveCompleted) { completedCount = completedCount + 1; }
  if (mealCompleted) { completedCount = completedCount + 1; }

  // Update hero progress bar
  var percentage = (completedCount / 3) * 100;
  document.getElementById("heroProgressBar").style.width = percentage + "%";
  document.getElementById("completedTasksCount").textContent = completedCount;
}


/* ==========================================================================
   10. INITIALIZATION
   Runs once when the webpage finishes loading in the browser.
   ========================================================================== */
window.onload = function () {
  // Set initial calorie calculations
  calculateCalories();
  updateDailyProgress();
};
