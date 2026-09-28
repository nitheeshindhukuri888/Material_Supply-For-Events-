
const KEY = "eventSupplyStaticData";

const defaultData = {
  organizations: [
    {id:1,name:"Royal Events",phone:"+91 90000 11111",email:"royal@example.com",address:"Tirupati"},
    {id:2,name:"Classic Celebrations",phone:"+91 90000 22222",email:"classic@example.com",address:"Kadapa"},
    {id:3,name:"Elite Event Works",phone:"+91 90000 33333",email:"elite@example.com",address:"Bengaluru"}
  ],
  customers: [
    {id:1,name:"Rahul & Family",phone:"+91 90000 44444",email:"rahul@example.com",address:"Tirupati"},
    {id:2,name:"Priya Sharma",phone:"+91 90000 55555",email:"priya@example.com",address:"Kadapa"}
  ],
  events: [
    {id:1,name:"Rahul Wedding",type:"Wedding",customerId:1,organizationId:1,date:"2026-11-20",location:"Tirupati",status:"Confirmed"},
    {id:2,name:"Corporate Annual Meet",type:"Corporate",customerId:2,organizationId:2,date:"2026-12-05",location:"Bengaluru",status:"Planning"}
  ],
  materials: [
    {id:1,name:"Banquet Chairs",category:"Furniture",quantity:500,available:420,price:45,organizationId:1},
    {id:2,name:"LED Stage Lights",category:"Lighting",quantity:80,available:55,price:350,organizationId:2},
    {id:3,name:"Sound Speakers",category:"Audio",quantity:20,available:15,price:1200,organizationId:3},
    {id:4,name:"Round Tables",category:"Furniture",quantity:50,available:40,price:250,organizationId:1}
  ],
  requests: [
    {id:1,eventId:1,materialId:2,quantity:10,status:"Pending"}
  ],
  collaborations: [
    {id:1,eventId:1,requestingId:1,partnerId:2,purpose:"LED stage lighting supply",status:"Pending"}
  ]
};

let data = JSON.parse(localStorage.getItem(KEY)) || defaultData;
let nextId = () => Date.now() + Math.floor(Math.random()*1000);

function save(){ localStorage.setItem(KEY, JSON.stringify(data)); renderAll(); }
function org(id){ return data.organizations.find(x=>x.id==id); }
function customer(id){ return data.customers.find(x=>x.id==id); }
function eventById(id){ return data.events.find(x=>x.id==id); }
function material(id){ return data.materials.find(x=>x.id==id); }

function renderAll(){
  document.getElementById("statOrganizations").textContent=data.organizations.length;
  document.getElementById("statCustomers").textContent=data.customers.length;
  document.getElementById("statEvents").textContent=data.events.length;
  document.getElementById("statMaterials").textContent=data.materials.length;
  document.getElementById("statRequests").textContent=data.requests.length;
  document.getElementById("statCollaborations").textContent=data.collaborations.length;

  document.getElementById("organizationList").innerHTML = data.organizations.map(o=>`
    <article class="info-card"><h3>${esc(o.name)}</h3>
    <p>${esc(o.address||"Address not provided")}</p>
    <p>${esc(o.phone||"Phone not provided")}</p>
    <p>${esc(o.email||"Email not provided")}</p></article>`).join("") || emptyCard("No organizations yet.");

  document.getElementById("customerList").innerHTML = data.customers.map(c=>`
    <article class="info-card"><h3>${esc(c.name)}</h3>
    <p>${esc(c.address||"Address not provided")}</p>
    <p>${esc(c.phone||"Phone not provided")}</p>
    <p>${esc(c.email||"Email not provided")}</p></article>`).join("") || emptyCard("No customers yet.");

  document.getElementById("eventTable").innerHTML = data.events.map(e=>`
    <tr><td><strong>${esc(e.name)}</strong></td><td>${esc(e.type)}</td><td>${esc(customer(e.customerId)?.name||"-")}</td>
    <td>${esc(org(e.organizationId)?.name||"-")}</td><td>${esc(e.date||"-")}</td><td><span class="badge">${esc(e.status)}</span></td></tr>`).join("") || rowEmpty(6);

  document.getElementById("materialList").innerHTML = data.materials.map(m=>`
    <article class="info-card"><h3>${esc(m.name)}</h3><p>${esc(m.category)}</p>
    <p><strong>${m.available}</strong> available / ${m.quantity} total</p>
    <p>₹${Number(m.price||0).toFixed(2)} per unit</p>
    <p>Owner: ${esc(org(m.organizationId)?.name||"-")}</p></article>`).join("") || emptyCard("No materials yet.");

  document.getElementById("requestTable").innerHTML = data.requests.map(r=>`
    <tr><td>${esc(eventById(r.eventId)?.name||"-")}</td><td>${esc(material(r.materialId)?.name||"-")}</td>
    <td>${r.quantity}</td><td><span class="badge">${esc(r.status)}</span></td>
    <td><select onchange="changeRequest(${r.id},this.value)"><option>Pending</option><option>Approved</option><option>Rejected</option><option>Delivered</option></select></td></tr>`).join("") || rowEmpty(5);

  document.getElementById("collaborationTable").innerHTML = data.collaborations.map(c=>`
    <tr><td>${esc(eventById(c.eventId)?.name||"-")}</td><td>${esc(org(c.requestingId)?.name||"-")}</td>
    <td>${esc(org(c.partnerId)?.name||"-")}</td><td>${esc(c.purpose)}</td><td><span class="badge">${esc(c.status)}</span></td>
    <td><select onchange="changeCollaboration(${c.id},this.value)"><option>Pending</option><option>Accepted</option><option>Rejected</option><option>Completed</option></select></td></tr>`).join("") || rowEmpty(6);
}
function emptyCard(t){return `<article class="info-card"><h3>${t}</h3></article>`}
function rowEmpty(n){return `<tr><td colspan="${n}" style="text-align:center;padding:30px;color:#777">No records yet.</td></tr>`}
function esc(v){return String(v??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}

function openModal(id){populateSelects();document.getElementById(id).classList.add("open")}
function closeModal(id){document.getElementById(id).classList.remove("open")}
function toggleMenu(){document.getElementById("mainNav").classList.toggle("open")}
function toast(msg){const t=document.getElementById("toast");t.textContent=msg;t.style.display="block";setTimeout(()=>t.style.display="none",2200)}

function populateSelects(){
  const orgOptions='<option value="">Select organization</option>'+data.organizations.map(o=>`<option value="${o.id}">${esc(o.name)}</option>`).join("");
  const customerOptions='<option value="">Select customer</option>'+data.customers.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("");
  const eventOptions='<option value="">Select event</option>'+data.events.map(e=>`<option value="${e.id}">${esc(e.name)}</option>`).join("");
  const materialOptions='<option value="">Select material</option>'+data.materials.map(m=>`<option value="${m.id}">${esc(m.name)} — ${m.available} available</option>`).join("");
  ["eventOrganization","materialOrganization","collabRequesting","collabPartner"].forEach(id=>document.getElementById(id).innerHTML=orgOptions);
  document.getElementById("eventCustomer").innerHTML=customerOptions;
  document.getElementById("requestEvent").innerHTML=eventOptions;
  document.getElementById("collabEvent").innerHTML=eventOptions;
  document.getElementById("requestMaterial").innerHTML=materialOptions;
}
function openEventModal(){populateSelects();openModal("eventModal")}
function openMaterialModal(){populateSelects();openModal("materialModal")}
function openRequestModal(){populateSelects();openModal("requestModal")}
function openCollaborationModal(){populateSelects();openModal("collaborationModal")}

function addOrganization(e){
  e.preventDefault();
  data.organizations.push({id:nextId(),name:orgName.value,phone:orgPhone.value,email:orgEmail.value,address:orgAddress.value});
  save(); e.target.reset(); closeModal("organizationModal"); toast("Organization added.");
}
function addCustomer(e){
  e.preventDefault();
  data.customers.push({id:nextId(),name:customerName.value,phone:customerPhone.value,email:customerEmail.value,address:customerAddress.value});
  save(); e.target.reset(); closeModal("customerModal"); toast("Customer added.");
}
function addEvent(e){
  e.preventDefault();
  data.events.push({id:nextId(),name:eventName.value,type:eventType.value,customerId:Number(eventCustomer.value),organizationId:Number(eventOrganization.value),date:eventDate.value,location:eventLocation.value,status:eventStatus.value});
  save(); e.target.reset(); closeModal("eventModal"); toast("Event created.");
}
function addMaterial(e){
  e.preventDefault();
  const q=Number(materialQuantity.value);
  data.materials.push({id:nextId(),name:materialName.value,category:materialCategory.value,quantity:q,available:q,price:Number(materialPrice.value||0),organizationId:Number(materialOrganization.value)});
  save(); e.target.reset(); closeModal("materialModal"); toast("Material added.");
}
function addRequest(e){
  e.preventDefault();
  const m=material(Number(requestMaterial.value)), q=Number(requestQuantity.value);
  if(!m || q<1){toast("Enter valid request details.");return}
  if(q>m.available){toast("Not enough material available.");return}
  m.available-=q;
  data.requests.push({id:nextId(),eventId:Number(requestEvent.value),materialId:m.id,quantity:q,status:"Pending"});
  save(); e.target.reset(); closeModal("requestModal"); toast("Material request created.");
}
function addCollaboration(e){
  e.preventDefault();
  if(Number(collabRequesting.value)===Number(collabPartner.value)){toast("Choose two different organizations.");return}
  data.collaborations.push({id:nextId(),eventId:Number(collabEvent.value),requestingId:Number(collabRequesting.value),partnerId:Number(collabPartner.value),purpose:collabPurpose.value,status:"Pending"});
  save(); e.target.reset(); closeModal("collaborationModal"); toast("Collaboration created.");
}
function changeRequest(id,status){const x=data.requests.find(r=>r.id==id);if(x){x.status=status;save();toast("Request status updated.")}}
function changeCollaboration(id,status){const x=data.collaborations.find(c=>c.id==id);if(x){x.status=status;save();toast("Collaboration status updated.")}}

window.addEventListener("click",e=>{if(e.target.classList.contains("modal"))e.target.classList.remove("open")});
document.addEventListener("DOMContentLoaded",renderAll);
