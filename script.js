document.addEventListener("DOMContentLoaded", () => {
  const button = document.querySelector(".button");
  const input = document.querySelector(".input");
  
  button.addEventListener("click", async () => {
      const username = input.value.trim();
      if (!username) return alert("Please enter a LeetCode username");
      
      button.disabled = true;
      button.textContent = "Searching...";
      
      try {
          const response = await fetch(`https://leetcode-stats-api.herokuapp.com/${username}`);
          if (!response.ok) throw new Error("User not found");
          
          const data = await response.json();
          updateProgress(data);
      } catch (error) {
          alert("Failed to fetch data. Please try again.");
          console.error(error);
      } finally {
          button.disabled = false;
          button.textContent = "Search";
      }
  });
});

function updateProgress(data) {
  const { easySolved, totalEasy, mediumSolved, totalMedium, hardSolved, totalHard, totalSolved, ranking } = data;
  
  const easyPercentage = totalEasy ? (easySolved / totalEasy) * 360 : 0;
  const mediumPercentage = totalMedium ? (mediumSolved / totalMedium) * 360 : 0;
  const hardPercentage = totalHard ? (hardSolved / totalHard) * 360 : 0;

  document.documentElement.style.setProperty("--easy", `${easyPercentage}deg`);
  document.documentElement.style.setProperty("--medium", `${mediumPercentage}deg`);
  document.documentElement.style.setProperty("--hard", `${hardPercentage}deg`);
  
  document.getElementById("easy-level").textContent = `${easySolved}/${totalEasy}`;
  document.getElementById("medium-level").textContent = `${mediumSolved}/${totalMedium}`;
  document.getElementById("hard-level").textContent = `${hardSolved}/${totalHard}`;

  document.getElementById("total-solved").textContent = totalSolved;
  document.getElementById("ranking").textContent = ranking || "N/A";

  const totalProblemsSolved = easySolved + mediumSolved + hardSolved;
  const totalProblems = totalEasy + totalMedium + totalHard;
  const progress = (totalProblemsSolved / totalProblems) * 100;
  document.getElementById("progress-bar-fill").style.width = `${progress}%`;
}

