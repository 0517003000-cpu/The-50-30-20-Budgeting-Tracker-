function cleanNumber(value){
return value.replace(/\./g,"")
}

function getNumber(value){
if(!value) return 0
return parseInt(cleanNumber(value)) || 0
}

function formatNumber(num){
return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")
}

// ===== FORMAT INPUT =====
function formatInput(e){
let value = e.target.value.replace(/\D/g,"")
if(!value){
  e.target.value = ""
  return
}
e.target.value = formatNumber(parseInt(value))
}

// ===== CALCULATE =====
function calculate(){

let e=0,n=0,s=0

document.querySelectorAll(".essential").forEach(i=>e+=getNumber(i.value))
document.querySelectorAll(".non").forEach(i=>n+=getNumber(i.value))
document.querySelectorAll(".save").forEach(i=>s+=getNumber(i.value))

document.getElementById("essentialTotal").innerText=formatNumber(e)
document.getElementById("nonTotal").innerText=formatNumber(n)
document.getElementById("saveTotal").innerText=formatNumber(s)

updateStatus(e,n,s)

if(document.getElementById("monthSelect").value){
saveData()
}
}

// ===== STATUS =====
function getStatus(total,budget){

if(!budget) return "-"

if(total>budget) return "Over Budget"
if(total>budget*0.85) return "Tight Budget"
return "Under Budget"
}

function updateStatus(e,n,s){

let eB=getNumber(document.getElementById("essentialBudget").value)
let nB=getNumber(document.getElementById("nonBudget").value)

let eS=getStatus(e,eB)
let nS=getStatus(n,nB)

document.getElementById("essentialStatus").innerText=eS
document.getElementById("nonStatus").innerText=nS

generateAdvice(eS,nS,s)
}

// ===== ADVICE =====
function advice(status,type){

if(status==="Over Budget"){
return `• You are over budget in ${type}.<br>
• Cut spending immediately.<br>
• Prioritize needs.<br>
• Set stricter limits.`
}

if(status==="Tight Budget"){
return `• Your budget is tight.<br>
• Be careful with extra spending.<br>
• Reduce unnecessary items.`
}

if(status==="Under Budget"){
return `• Good job staying under budget.<br>
• Keep tracking consistently.<br>
• Save the extra money.`
}

return `• Fill your budget to get advice.`
}

// ===== GENERATE ADVICE =====
function generateAdvice(e,n,s){

let saveBudget = getNumber(document.getElementById("saveBudget").value)

let savingsText = ""

if(!saveBudget){
  savingsText = "• Enter your savings budget to get recommendations."
}
else if(s === 0){
  savingsText = `• You have not allocated your savings yet.<br>
• A good way to manage savings is by dividing it into purposes:<br>
• 50% Emergency Fund<br>
• 30% Investment<br>
• 20% Personal Goals<br>
• Start small and stay consistent.`
}
else{
  let emergency = Math.floor(s * 0.5)
  let invest = Math.floor(s * 0.3)
  let goals = Math.floor(s * 0.2)

  savingsText = `• Here’s a recommended way to manage your current savings:<br><br>

• Emergency Fund: ~${formatNumber(emergency)} (50%)<br>
• Investment: ~${formatNumber(invest)} (30%)<br>
• Personal Goals: ~${formatNumber(goals)} (20%)<br><br>

• Build your emergency fund until it covers 3–6 months of expenses.<br>
• Invest regularly for long-term growth.<br>
• Use goal savings for planned needs, not impulsive spending.`
}

document.getElementById("advice").innerHTML = `
<b>Essential Expenses</b><br>
Status: ${e}<br>
${advice(e,"essential expenses")}<br><br>

<b>Non Essential Expenses</b><br>
Status: ${n}<br>
${advice(n,"non essential expenses")}<br><br>

<b>Savings</b><br>
${savingsText}
`
}

// ===== SAVE =====
function saveData(){

let m=document.getElementById("monthSelect").value
if(!m) return

let data={
name:document.getElementById("name").value,
income:document.getElementById("income").value,
eB:document.getElementById("essentialBudget").value,
nB:document.getElementById("nonBudget").value,
sB:document.getElementById("saveBudget").value,
e:[],n:[],s:[]
}

document.querySelectorAll(".essential").forEach(i=>data.e.push(i.value))
document.querySelectorAll(".non").forEach(i=>data.n.push(i.value))
document.querySelectorAll(".save").forEach(i=>data.s.push(i.value))

localStorage.setItem("budget-"+m,JSON.stringify(data))
}

// ===== LOAD =====
function loadData(m){

let d=JSON.parse(localStorage.getItem("budget-"+m))
if(!d) return

document.getElementById("name").value=d.name||""
document.getElementById("income").value=d.income||""
document.getElementById("essentialBudget").value=d.eB||""
document.getElementById("nonBudget").value=d.nB||""
document.getElementById("saveBudget").value=d.sB||""

document.querySelectorAll(".essential").forEach((i,x)=>i.value=d.e[x]||"")
document.querySelectorAll(".non").forEach((i,x)=>i.value=d.n[x]||"")
document.querySelectorAll(".save").forEach((i,x)=>i.value=d.s[x]||"")

calculate()
}

// ===== MONTH =====
function newMonth(){

let m=prompt("Enter Month (Example: March 2026)")
if(!m) return

let s=document.getElementById("monthSelect")

let o=document.createElement("option")
o.value=m
o.text=m

s.appendChild(o)
s.value=m

document.querySelectorAll("input").forEach(i=>i.value="")
}

// ===== EVENTS =====
document.getElementById("monthSelect").addEventListener("change",function(){
loadData(this.value)
})

document.querySelectorAll(".essential, .non, .save").forEach(i=>{
i.addEventListener("input", function(e){
  formatInput(e)
  calculate()
})
})

document.getElementById("essentialBudget").addEventListener("input", function(e){
formatInput(e)
calculate()
})

document.getElementById("nonBudget").addEventListener("input", function(e){
formatInput(e)
calculate()
})

document.getElementById("saveBudget").addEventListener("input", function(e){
formatInput(e)
calculate()
})

document.getElementById("name").addEventListener("input",saveData)
document.getElementById("income").addEventListener("input",saveData)

// run once
calculate()
