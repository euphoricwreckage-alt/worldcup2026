// 2026 World Cup Groups (from December 5, 2025 draw)
const GROUPS = {
    'A': ['Mexico', 'South Africa', 'South Korea', 'UEFA Playoff D'],
    'B': ['Canada', 'Switzerland', 'Qatar', 'UEFA Playoff A'],
    'C': ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
    'D': ['USA', 'Paraguay', 'Australia', 'UEFA Playoff C'],
    'E': ['Germany', 'Curacao', "Cote d'Ivoire", 'Ecuador'],
    'F': ['Netherlands', 'Japan', 'Tunisia', 'UEFA Playoff B'],
    'G': ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
    'H': ['Spain', 'Uruguay', 'Saudi Arabia', 'Cabo Verde'],
    'I': ['France', 'Norway', 'Senegal', 'Playoff Winner'],
    'J': ['Argentina', 'Austria', 'Algeria', 'Jordan'],
    'K': ['Portugal', 'Colombia', 'Uzbekistan', 'Intercontinental Playoff 1'],
    'L': ['England', 'Croatia', 'Ghana', 'Panama']
};

// Global state
let groupStandings = {};
let knockoutBracket = {
    'Round of 32': [],
    'Round of 16': [],
    'Quarter Finals': [],
    'Semi Finals': [],
    'Third Place': [],
    'Final': []
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeGroups();
    generateGroupStage();
});

// Tab switching
function showTab(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });

    buttons.forEach(btn => {
        btn.classList.remove('active');
    });

    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Initialize group standings
function initializeGroups() {
    Object.keys(GROUPS).forEach(groupName => {
        groupStandings[groupName] = GROUPS[groupName].map(team => ({
            team: team,
            played: 0,
            won: 0,
            drawn: 0,
            lost: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            points: 0
        }));
    });
}

// Generate group stage UI
function generateGroupStage() {
    const container = document.getElementById('groups-container');
    container.innerHTML = '';

    Object.keys(GROUPS).forEach(groupName => {
        const groupCard = createGroupCard(groupName, GROUPS[groupName]);
        container.appendChild(groupCard);
    });
}

// Create group card
function createGroupCard(groupName, teams) {
    const card = document.createElement('div');
    card.className = 'group-card';

    // Header
    const header = document.createElement('div');
    header.className = 'group-header';
    header.textContent = `Group ${groupName}`;
    card.appendChild(header);

    // Standings table
    const table = document.createElement('table');
    table.className = 'standings-table';
    table.id = `standings-${groupName}`;

    // Table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>Team</th>
            <th>P</th>
            <th>W</th>
            <th>D</th>
            <th>L</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Pts</th>
        </tr>
    `;
    table.appendChild(thead);

    // Table body
    const tbody = document.createElement('tbody');
    tbody.id = `tbody-${groupName}`;
    teams.forEach(team => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${team}</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
            <td>0</td>
        `;
        tbody.appendChild(row);
    });
    table.appendChild(tbody);
    card.appendChild(table);

    // Match input section
    const matchInput = document.createElement('div');
    matchInput.className = 'match-input';

    const matchTitle = document.createElement('h4');
    matchTitle.textContent = 'Enter Match Results:';
    matchInput.appendChild(matchTitle);

    // Generate all matches
    const matches = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push([teams[i], teams[j]]);
        }
    }

    matches.forEach(([home, away], idx) => {
        const matchRow = document.createElement('div');
        matchRow.className = 'match-row';
        matchRow.innerHTML = `
            <span class="team-name home">${home.substring(0, 15)}</span>
            <input type="number" min="0" max="20" id="home-${groupName}-${idx}" />
            <span>-</span>
            <input type="number" min="0" max="20" id="away-${groupName}-${idx}" />
            <span class="team-name away">${away.substring(0, 15)}</span>
        `;
        matchInput.appendChild(matchRow);
    });

    card.appendChild(matchInput);

    // Update button
    const updateBtn = document.createElement('button');
    updateBtn.className = 'update-btn';
    updateBtn.textContent = 'Update Standings';
    updateBtn.onclick = () => updateGroupStandings(groupName);
    card.appendChild(updateBtn);

    return card;
}

// Update group standings
function updateGroupStandings(groupName) {
    // Reset standings
    groupStandings[groupName].forEach(team => {
        team.played = 0;
        team.won = 0;
        team.drawn = 0;
        team.lost = 0;
        team.gf = 0;
        team.ga = 0;
        team.gd = 0;
        team.points = 0;
    });

    // Get all matches
    const teams = GROUPS[groupName];
    const matches = [];
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            matches.push([teams[i], teams[j]]);
        }
    }

    // Process each match
    matches.forEach((match, idx) => {
        const homeInput = document.getElementById(`home-${groupName}-${idx}`);
        const awayInput = document.getElementById(`away-${groupName}-${idx}`);

        if (homeInput.value === '' || awayInput.value === '') return;

        const homeScore = parseInt(homeInput.value);
        const awayScore = parseInt(awayInput.value);

        const homeTeam = groupStandings[groupName].find(t => t.team === match[0]);
        const awayTeam = groupStandings[groupName].find(t => t.team === match[1]);

        // Update stats
        homeTeam.played++;
        awayTeam.played++;
        homeTeam.gf += homeScore;
        homeTeam.ga += awayScore;
        awayTeam.gf += awayScore;
        awayTeam.ga += homeScore;

        if (homeScore > awayScore) {
            homeTeam.won++;
            homeTeam.points += 3;
            awayTeam.lost++;
        } else if (awayScore > homeScore) {
            awayTeam.won++;
            awayTeam.points += 3;
            homeTeam.lost++;
        } else {
            homeTeam.drawn++;
            awayTeam.drawn++;
            homeTeam.points++;
            awayTeam.points++;
        }

        homeTeam.gd = homeTeam.gf - homeTeam.ga;
        awayTeam.gd = awayTeam.gf - awayTeam.ga;
    });

    // Sort by points, then GD, then GF
    groupStandings[groupName].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });

    // Update display
    const tbody = document.getElementById(`tbody-${groupName}`);
    tbody.innerHTML = '';

    groupStandings[groupName].forEach((team, idx) => {
        const row = document.createElement('tr');
        if (idx < 2) row.classList.add('qualified');

        row.innerHTML = `
            <td>${team.team}</td>
            <td>${team.played}</td>
            <td>${team.won}</td>
            <td>${team.drawn}</td>
            <td>${team.lost}</td>
            <td>${team.gf}</td>
            <td>${team.ga}</td>
            <td>${team.gd}</td>
            <td>${team.points}</td>
        `;
        tbody.appendChild(row);
    });
}

// Generate knockout bracket
function generateKnockoutBracket() {
    // Check if at least some groups have results
    let hasResults = false;
    Object.values(groupStandings).forEach(group => {
        if (group.some(t => t.played > 0)) hasResults = true;
    });

    if (!hasResults) {
        alert('Please enter results for at least some groups first!');
        return;
    }

    // Get top 2 from each group
    const qualified = {};
    Object.keys(GROUPS).forEach(groupName => {
        qualified[groupName] = [
            groupStandings[groupName][0].team,
            groupStandings[groupName][1].team
        ];
    });

    // Get third place teams
    const thirdPlace = [];
    Object.keys(GROUPS).forEach(groupName => {
        if (groupStandings[groupName].length >= 3) {
            const third = groupStandings[groupName][2];
            thirdPlace.push({
                team: third.team,
                group: groupName,
                points: third.points,
                gd: third.gd,
                gf: third.gf
            });
        }
    });

    // Sort and take best 8
    thirdPlace.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });
    const bestThirds = thirdPlace.slice(0, 8).map(t => t.team);

    // Create Round of 32
    const winners = [];
    const runnersUp = [];
    Object.keys(qualified).sort().forEach(group => {
        winners.push(qualified[group][0]);
        runnersUp.push(qualified[group][1]);
    });

    const allQualified = [...winners, ...runnersUp, ...bestThirds];
    const roundOf32 = [];
    for (let i = 0; i < allQualified.length; i += 2) {
        if (i + 1 < allQualified.length) {
            roundOf32.push([allQualified[i], allQualified[i + 1]]);
        }
    }

    knockoutBracket['Round of 32'] = roundOf32;

    // Show knockout tab and draw bracket
    showTab('knockout-stage');
    document.querySelectorAll('.tab-button')[1].classList.add('active');
    document.querySelectorAll('.tab-button')[0].classList.remove('active');

    drawKnockoutBracket();

    alert('Knockout bracket generated! Enter match results to advance.');
}

// Draw knockout bracket
function drawKnockoutBracket() {
    const container = document.getElementById('knockout-container');
    container.innerHTML = '';

    // Hide info message
    document.querySelector('.knockout-info').style.display = 'none';

    // Show and update progress
    const progressBox = document.getElementById('knockout-progress');
    progressBox.style.display = 'block';

    const progressList = document.getElementById('progress-list');
    progressList.innerHTML = '';

    Object.keys(knockoutBracket).forEach(round => {
        if (knockoutBracket[round].length > 0) {
            const p = document.createElement('div');
            p.textContent = `✓ ${round} generated`;
            progressList.appendChild(p);
        }
    });

    // Draw each round
    ['Round of 32', 'Round of 16', 'Quarter Finals', 'Semi Finals', 'Third Place', 'Final'].forEach(round => {
        if (knockoutBracket[round].length > 0) {
            const roundSection = createRoundSection(round, knockoutBracket[round]);
            container.appendChild(roundSection);
        }
    });
}

// Create round section
function createRoundSection(roundName, matches) {
    const section = document.createElement('div');
    section.className = 'round-section';

    const header = document.createElement('div');
    header.className = 'round-header';
    header.textContent = `⚽ ${roundName} (${matches.length} match${matches.length > 1 ? 'es' : ''})`;
    section.appendChild(header);

    matches.forEach((match, idx) => {
        const matchDiv = document.createElement('div');
        matchDiv.className = 'knockout-match';
        matchDiv.innerHTML = `
            <label>Match ${idx + 1}:</label>
            <span class="team-label home">${match[0]}</span>
            <input type="number" min="0" max="20" id="ko-${roundName}-${idx}-home" />
            <span class="vs">-</span>
            <input type="number" min="0" max="20" id="ko-${roundName}-${idx}-away" />
            <span class="team-label away">${match[1]}</span>
            <span class="winner-label" id="winner-${roundName}-${idx}"></span>
        `;
        section.appendChild(matchDiv);
    });

    // Advance button
    const isFinal = roundName === 'Final' || roundName === 'Third Place';
    const btn = document.createElement('button');
    btn.className = 'advance-btn';
    btn.textContent = isFinal ? 'Show Winner' : 'Advance to Next Round';
    btn.onclick = () => isFinal ? showTournamentWinner(roundName) : advanceRound(roundName);
    section.appendChild(btn);

    return section;
}

// Advance round
function advanceRound(currentRound) {
    const matches = knockoutBracket[currentRound];
    const winners = [];

    for (let i = 0; i < matches.length; i++) {
        const homeInput = document.getElementById(`ko-${currentRound}-${i}-home`);
        const awayInput = document.getElementById(`ko-${currentRound}-${i}-away`);

        if (!homeInput.value || !awayInput.value) {
            alert(`Please fill in all scores for ${currentRound}`);
            return;
        }

        const homeScore = parseInt(homeInput.value);
        const awayScore = parseInt(awayInput.value);
        const homeTeam = matches[i][0];
        const awayTeam = matches[i][1];

        let winner;
        if (homeScore > awayScore) {
            winner = homeTeam;
            document.getElementById(`winner-${currentRound}-${i}`).textContent = `✓ ${homeTeam} wins!`;
        } else if (awayScore > homeScore) {
            winner = awayTeam;
            document.getElementById(`winner-${currentRound}-${i}`).textContent = `✓ ${awayTeam} wins!`;
        } else {
            // Penalty shootout
            const penaltyWinner = confirm(`${homeTeam} vs ${awayTeam} is tied!\n\nClick OK if ${homeTeam} won on penalties\nClick Cancel if ${awayTeam} won on penalties`);
            winner = penaltyWinner ? homeTeam : awayTeam;
            document.getElementById(`winner-${currentRound}-${i}`).textContent = `✓ ${winner} wins (pens)!`;
        }

        winners.push(winner);
    }

    // Determine next round
    const nextRoundMap = {
        'Round of 32': 'Round of 16',
        'Round of 16': 'Quarter Finals',
        'Quarter Finals': 'Semi Finals',
        'Semi Finals': 'Final'
    };

    if (currentRound === 'Semi Finals' && winners.length === 2) {
        // Create final
        knockoutBracket['Final'] = [[winners[0], winners[1]]];

        // Get losers for third place
        const losers = [];
        for (let i = 0; i < matches.length; i++) {
            const homeScore = parseInt(document.getElementById(`ko-${currentRound}-${i}-home`).value);
            const awayScore = parseInt(document.getElementById(`ko-${currentRound}-${i}-away`).value);
            const homeTeam = matches[i][0];
            const awayTeam = matches[i][1];

            const loser = homeScore > awayScore ? awayTeam : (awayScore > homeScore ? homeTeam : null);
            if (loser && !winners.includes(loser)) {
                losers.push(loser);
            }
        }

        if (losers.length === 2) {
            knockoutBracket['Third Place'] = [[losers[0], losers[1]]];
        }
    } else if (nextRoundMap[currentRound]) {
        const nextRound = nextRoundMap[currentRound];
        const nextMatches = [];
        for (let i = 0; i < winners.length; i += 2) {
            if (i + 1 < winners.length) {
                nextMatches.push([winners[i], winners[i + 1]]);
            }
        }
        knockoutBracket[nextRound] = nextMatches;
    }

    // Redraw
    drawKnockoutBracket();

    // Success message
    if (currentRound === 'Semi Finals') {
        alert(`${currentRound} complete!\n\nFinal: ${winners[0]} vs ${winners[1]}\n\nScroll down to see the Final and Third Place matches!`);
    } else {
        const nextRoundName = nextRoundMap[currentRound];
        alert(`${currentRound} complete!\n\n${winners.length} teams advanced to ${nextRoundName}\n\nScroll down to see the next round matches!`);
    }

    // Scroll to bottom
    document.getElementById('knockout-container').scrollTop = document.getElementById('knockout-container').scrollHeight;
}

// Show tournament winner
function showTournamentWinner(roundName) {
    const match = knockoutBracket[roundName][0];
    const homeInput = document.getElementById(`ko-${roundName}-0-home`);
    const awayInput = document.getElementById(`ko-${roundName}-0-away`);

    if (!homeInput.value || !awayInput.value) {
        alert('Please enter the final score!');
        return;
    }

    const homeScore = parseInt(homeInput.value);
    const awayScore = parseInt(awayInput.value);
    const homeTeam = match[0];
    const awayTeam = match[1];

    let winner;
    if (homeScore > awayScore) {
        winner = homeTeam;
    } else if (awayScore > homeScore) {
        winner = awayTeam;
    } else {
        const penaltyWinner = confirm(`The ${roundName} is tied!\n\nClick OK if ${homeTeam} won on penalties\nClick Cancel if ${awayTeam} won on penalties`);
        winner = penaltyWinner ? homeTeam : awayTeam;
    }

    document.getElementById(`winner-${roundName}-0`).textContent = `✓ ${winner} WINS!`;

    if (roundName === 'Final') {
        alert(`🏆 WORLD CUP CHAMPION! 🏆\n\n${winner}\n\nWINS THE 2026 FIFA WORLD CUP!\n\n⚽ Champions! ⚽`);
    } else {
        alert(`${winner} finishes in 3rd place!`);
    }
}

// Save simulation
function saveSimulation() {
    const data = {
        groupStandings,
        knockoutBracket,
        timestamp: new Date().toISOString()
    };

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `WorldCup2026_Sim_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
    a.click();

    URL.revokeObjectURL(url);

    alert('Simulation saved successfully!');
}

// Load simulation
function loadSimulation() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';

    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                groupStandings = data.groupStandings;
                knockoutBracket = data.knockoutBracket;

                // Update group displays
                Object.keys(groupStandings).forEach(groupName => {
                    updateGroupStandings(groupName);
                });

                // Update knockout if exists
                if (knockoutBracket['Round of 32'].length > 0) {
                    drawKnockoutBracket();
                }

                alert('Simulation loaded successfully!');
            } catch (error) {
                alert('Failed to load simulation: ' + error.message);
            }
        };
        reader.readAsText(file);
    };

    input.click();
}

// Reset all
function resetAll() {
    if (!confirm('Reset entire simulation? This cannot be undone.')) return;

    // Reset data
    initializeGroups();
    knockoutBracket = {
        'Round of 32': [],
        'Round of 16': [],
        'Quarter Finals': [],
        'Semi Finals': [],
        'Third Place': [],
        'Final': []
    };

    // Clear all inputs
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.value = '';
    });

    // Reset displays
    generateGroupStage();
    document.getElementById('knockout-container').innerHTML = '';
    document.querySelector('.knockout-info').style.display = 'block';
    document.getElementById('knockout-progress').style.display = 'none';

    alert('Simulation reset successfully!');
}

// Show about
function showAbout() {
    alert(`FIFA World Cup 2026 Tournament Simulator

Based on official draw results from December 5, 2025

Features:
• All 12 groups with actual teams
• Enter match scores and see live standings
• Automatic qualification calculation (top 2 + best 3rd place)
• Knockout bracket generation
• Save/load simulations to test different scenarios
• Works completely offline in your browser

Groups advance top 2 teams each, plus 8 best third-place teams
for a 32-team knockout stage.

Created with HTML, CSS, and JavaScript
No internet connection required!

Tips:
- Enter scores in group stage
- Click "Update Standings" for each group
- Click "Generate Knockout Bracket" when ready
- Save your scenarios to compare different outcomes

Enjoy simulating the 2026 World Cup! ⚽`);
}
