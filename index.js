import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import {getAuth,signOut,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"
import {getFirestore,doc,getDoc,getDocs,documentId,addDoc,setDoc,updateDoc,deleteDoc,query,where,or,collection} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-firestore.js"

const firebaseConfig = {
apiKey: "AIzaSyAgjuQ_mJSJb0QZCZpfOTNACVOXGpEOfqo",
authDomain: "mindx-bb092.firebaseapp.com",
databaseURL: "https://mindx-bb092-default-rtdb.asia-southeast1.firebasedatabase.app",
projectId: "mindx-bb092",
storageBucket: "mindx-bb092.firebasestorage.app",
messagingSenderId: "305366342255",
appId: "1:305366342255:web:b8037ceb354110bd160b9a",
measurementId: "G-F00W3LCYJZ"
};


const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)
const auth = getAuth();
let signOutBtn = document.getElementById("signOut")
let switchs = document.querySelectorAll(".switch")
let codeInput = document.getElementById("codeInput")
let submitCode = document.getElementById("submitCode")


//STUDENT ELEMENT
let allStudents = []
let studentsList = document.getElementById("studentsList")
let addStudent = document.getElementById("addStudent")
let addStudentId = document.getElementById("addStudentId")
let addStudentName = document.getElementById("addStudentName")
let addStudentAge = document.getElementById("addStudentAge")
let addStudentClass = document.getElementById("addStudentClass")


//TEACHER ELEMENT
let allTeachers = []
let teachersList = document.getElementById("teachersList")
let addTeacher = document.getElementById("addTeacher")
let addTeacherId = document.getElementById("addTeacherId")
let addTeacherName = document.getElementById("addTeacherName")
let addTeacherAge = document.getElementById("addTeacherAge")
let addTeacherClass = document.getElementById("addTeacherClass")
let addTeacherSubject = document.getElementById("addTeacherSubject")

//OTHER
let kpi = document.getElementsByClassName("kpi")
let openModal = document.getElementById("openModal")
let curUser;
const filterClass1 = document.getElementById("filterClass1")
const filterClass2 = document.getElementById("filterClass2")
let classes1 = new Set();
let classes2 = new Set();
let findSubmit = document.getElementById("findSubmit")
let findInput = document.getElementById("findInput")
let result = []

//SHOW CODE INPUT
function showInviteModal() {
  const modalEl = document.getElementById("myModal");
  const modal = new bootstrap.Modal(modalEl, {
    backdrop: "static",
    keyboard: false
  });
  modal.show();
}

//SIGN-OUT FUNCTION
signOutBtn.addEventListener("click",(e)=>{
    signOut(auth)
    .then(()=>{
        window.location.href = "auth.html"
    })
    .catch((error)=>{             
        const errorMessage = error.message
        alert(errorMessage)
    })
})   

//WAIT FUNCTION
function setLoading(btn, isLoading) {
    if (isLoading) {
        btn.classList.add("loading");
    } else {
        btn.classList.remove("loading");
    }
}


//DISPLAY STUDENT
function renderStudents(list) {
  //studentsList.innerHTML = ""

  list.forEach(st => {
    let tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${st.id}</td>
      <td>${st.name}</td>
      <td>${st.class}</td>
      <td>${st.age}</td>
      <td>
        <div class="actions">
          <a class="btn ghost">Xem</a>
          <a class="btn deleteStudent" data-student-id="${st.id}">Xóa</a>
        </div>
      </td>
    `
    studentsList.appendChild(tr)
    const deleteBtn = tr.querySelector(".deleteStudent");
    deleteBtn.addEventListener("click", async() =>
    {
        if(curUser.role!="admin" && curUser.role!="teacher" && curUser.role!="headteacher")
        {
            alert("You dont have permisson to do this")
            return
        }
        try
        {
            setLoading(deleteBtn, true);

            await deleteDoc(doc(db,"schools",curUser.schoolID,"studentsList",`${deleteBtn.dataset.studentId}`))
            removeStudentRowByButton(deleteBtn);
            allStudents = allStudents.filter(tch=>tch.id!==deleteBtn.dataset.studentId)
            console.log(allStudents)

            setLoading(deleteBtn, false);
        } catch(err){  console.log(err)}
    });
  })
}

//REMOVE STUDENT
function removeStudentRowByButton(btn) {
    const tr = btn.closest("tr");
    if (!tr) return;
    kpi[0].innerText = Number(kpi[0].innerText) - 1;
    tr.remove();
}

//UPDATE STUDENT FILTER



//DISPLAY TEACHER
function renderTeachers(list) {
  //teachersList.innerHTML = ""

  list.forEach(st => {
    let tr = document.createElement("tr")

    tr.innerHTML = `
      <td>${st.id}</td>
      <td>${st.name}</td>
      <td>${st.class}</td>
      <td>${st.age}</td>
      <td>
        <div class="actions">
          <a class="btn ghost">Xem</a>
          <a class="btn deleteTeacher" data-teacher-id="${st.id}">Xóa</a>
        </div>
      </td>
    `
    teachersList.appendChild(tr)

    const deleteBtn = tr.querySelector(".deleteTeacher");
    deleteBtn.addEventListener("click", async() =>
    {
        if(curUser.role!="admin" && curUser.role!="teacher" && curUser.role!="headteacher")
        {
            alert("You dont have permisson to do this")
            return
        }
        try
        {
            setLoading(deleteBtn, true);

            await deleteDoc(doc(db,"schools",curUser.schoolID,"teachersList",`${deleteBtn.dataset.teacherId}`))
            removeTeacherRowByButton(deleteBtn);
            allTeachers = allTeachers.filter(tch=>tch.id!==deleteBtn.dataset.teacherId)
            console.log(allTeachers)

            setLoading(deleteBtn, false);

        } catch(err){  console.log(err)}
    });
  })
}





function removeTeacherRowByButton(btn) {
    const tr = btn.closest("tr");
    if (!tr) return;
    kpi[1].innerText = Number(kpi[1].innerText) - 1;
    tr.remove();
}


onAuthStateChanged(auth,async(user)=>{
    if(!user)
    {
        alert("Chưa đăng nhập")
        return
    }
    let ref = doc(db,"usersIndex",`${user.uid}`)
    let snap = await getDoc(ref)
    if(!snap.exists())
    {   
        showInviteModal();
        submitCode.addEventListener("click",async ()=>{
            const codeRef = doc(db,"code",`${codeInput.value}`)
            const codeData = await getDoc(codeRef)
            if(codeData.data().used==false )
            {
                await setDoc(doc(db,"usersIndex",user.uid),
                {
                    "role":codeData.data().role,
                    "name":codeData.data().name,
                    age:codeData.data().age,
                    "class":codeData.data().class,
                    "id":codeData.data().id,
                    "schoolID":codeData.data().schoolID

                });
                await updateDoc(
                    doc(db,"code",`${codeInput.value}`),
                    { "used":true}
                );
                alert("Succes")
            }
            else
            {
                alert("Invalid Code or Used Code")
                return
            } 
        })
    }
    else
    {
       openModal.style.display="none"
       const userData = snap.data()
       curUser = {
            role:userData.role,
            name:userData.name,
            age:userData.age,
            class:userData.class,
            id:userData.id,
            schoolID:userData.schoolID
       }
       alert(`Hello ${curUser.role} ${curUser.name} school ${curUser.schoolID} `)
       console.log(curUser)


       //DISPLAY STUDENTS
       const students = collection(db,"schools",curUser.schoolID,"studentsList")
       snap = await getDocs(students)
       snap.forEach(doc=>{
            allStudents.push(
            {
                id:doc.id,
                name:doc.data().name,
                class:doc.data().class,
                age:doc.data().age
            })  
       })
       kpi[0].innerText = allStudents.length
       console.log(allStudents)
       renderStudents(allStudents) 

       ////////Filter student
       classes1 = [...new Set(allStudents.map(s => s.class))]
       classes1.forEach(c=>{
            let opt =  document.createElement("option")
            opt.value = c
            opt.innerText = c
            filterClass1.appendChild(opt)
       })
       filterClass1.addEventListener("change",()=>{
        studentsList.innerHTML = ""
          let value = filterClass1.value
          if(value == "all") renderStudents(allStudents);
          else
          {
            let filtered = allStudents.filter(s=>s.class==value)
            renderStudents(filtered)
          }
       })


       //DISPLAY TEACHERS
       const teachers =  collection(db,"schools",curUser.schoolID,"teachersList")
       snap = await getDocs(teachers)
       snap.forEach(doc=>{
            allTeachers.push(
            {
                id:doc.id,
                name:doc.data().name,
                class:doc.data().class,
                age:doc.data().age
            })
       })
       console.log(allTeachers)
       kpi[1].innerText = allTeachers.length
       renderTeachers(allTeachers)
       //FILTER TEACHER
       classes2 = [...new Set(allTeachers.map(s => s.class))]
       classes2.forEach(c=>{
            let opt =  document.createElement("option")
            opt.value = c
            opt.innerText = c
            filterClass2.appendChild(opt)
       })
       filterClass2.addEventListener("change",()=>{
          teachersList.innerHTML = ""
          let value = filterClass2.value
          if(value == "all") renderTeachers(allTeachers);
          else
          {
            let filtered = allTeachers.filter(s=>s.class==value)
            renderTeachers(filtered)
          }
       })


    }
    

    



    //ADD STTUDENT FUNCTION
    addStudent.addEventListener("submit",async(e)=>
    {
        e.preventDefault()
        if(curUser.role!="admin" && curUser.role!="teacher" && curUser.role!="headteacher")
        {
            alert("You dont have permisson to do this")
            return
        }
        const submitBtn = addStudent.querySelector("button[type='submit']");
        setLoading(submitBtn, true);
        let docRef = await addDoc(
            collection(db,"code"),
            {   
                "id":addStudentId.value, 
                "name":addStudentName.value,
                age:addStudentAge.value,
                "class":addStudentClass.value,
                used: false,
                "role":"student",
                "schoolID":curUser.schoolID
            }
        )
        alert(`Mã mời của tài khoản là:${docRef.id}`)
        setDoc(doc(db,"schools",curUser.schoolID,"studentsList",addStudentId.value),
        {
            "id":addStudentId.value,
            "age":addStudentAge.value,
            "class":addStudentClass.value,
            "name":addStudentName.value
        });
        if(!allStudents.find(o=>o.id==addStudentId.value))
        {
            allStudents.push({
            "id":addStudentId.value,
            "age":addStudentAge.value,
            "class":addStudentClass.value,
            "name":addStudentName.value})
            kpi[0].innerText = Number(kpi[0].innerText) +1
        }
        if(!classes1.includes(addStudentClass.value))classes1.push(addStudentClass.value);
        filterClass1.innerHTML = `<option value="all">Tất cả lớp</option>`
        classes1.forEach(c=>{
            let opt =  document.createElement("option")
            opt.value = c
            opt.innerText = c
            filterClass1.appendChild(opt)
       })
        renderStudents([
        {
            id:addStudentId.value,
            name: addStudentName.value,
            class: addStudentClass.value,
            age: addStudentAge.value 
        }])
        addStudent.reset();
        setLoading(submitBtn, false);
    })

    //ADD TEACHER FUNCTION
   addTeacher.addEventListener("submit",async(e)=>
    {
        e.preventDefault()
        if(curUser.role!="admin" && curUser.role!="teacher" && curUser.role!="headteacher")
        {
            alert("You dont have permisson to do this")
            return
        }
        const submitBtn = addTeacher.querySelector("button[type='submit']");
        setLoading(submitBtn, true);
        let docRef = await addDoc(
            collection(db,"code"),
            {   
                "id":addTeacherId.value, 
                "name":addTeacherName.value,
                age:addTeacherAge.value,
                "class":addTeacherClass.value,
                used: false,
                "role":"teacher",
                "schoolID":curUser.schoolID
            }
        )
        alert(`Mã mời của tài khoản là:${docRef.id}`)
        setDoc(doc(db,"schools",curUser.schoolID,"teachersList",addTeacherId.value),
        {
            "id":addTeacherId.value,
            "age":addTeacherAge.value,
            "class":addTeacherClass.value,
            "name":addTeacherName.value
        })
        if(!allTeachers.find(o=>o.id==addTeacherId.value))
        {
            allTeachers.push({
            "id":addTeacherId.value,
            "age":addTeacherAge.value,
            "class":addTeacherClass.value,
            "name":addTeacherName.value})
            kpi[1].innerText = Number(kpi[1].innerText) +1
        }
        if(!classes2.includes(addTeacherClass.value))classes2.push(addTeacherClass.value);
        filterClass2.innerHTML = `<option value="all">Tất cả lớp</option>`
        classes2.forEach(c=>{
            let opt =  document.createElement("option")
            opt.value = c
            opt.innerText = c
            filterClass2.appendChild(opt)
       })
        renderTeachers([
        {
            id:addTeacherId.value,
            name: addTeacherName.value,
            class: addTeacherClass.value,
            age: addTeacherAge.value
        }])
        addTeacher.reset();
        setLoading(submitBtn, false);
    })
    findSubmit.addEventListener("click",async()=>{
        switchs[1].click()
        result = []
        let students = query(
            collection(db,"schools",curUser.schoolID,"studentsList"),
            or(
                where("id","==",findInput.value.trim()),
                where("name","==",findInput.value.trim())
            )
        )
        let snap  = await getDocs(students)
        console.log(snap)
        snap.forEach(doc=>{
            result.push({
                id:doc.id,
                name:doc.data().name,
                class:doc.data().class,
                age:doc.data().age
            })
        })
        console.log(result)
        studentsList.innerHTML = ""
        renderStudents(result)

    })

});


switchs.forEach(e =>
{
    e.addEventListener("click",()=>{
        document.querySelector(".switch.active").classList.remove("active")
        e.classList.add("active")
      
        document.querySelector(".page.display")?.classList.remove("display")
        let tmp = e.classList[1]
        document.querySelector(`.page.${tmp}`).classList.add("display")
    })  
});












