"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NextResponse } from "next/server";
import Image from 'next/image';
import formImage from "../../public/formImages.jpg"
import styles from "../../styles/forms.module.css";

const Agency = () => {

  const nameOfChildToAddRef = useRef();
  const sexOfChildToAddRef = useRef();
  const ageOfChildToAddRef = useRef();
  const genDisorderToAddRef = useRef();
  const Adstat = useRef();
  const childID = useRef();
  const DOAAddToRef = useRef();
  const DOBAddToRef = useRef();
  const [agencyid, setAgencyID] = useState();

  useEffect(() => {
    setAgencyID(localStorage.getItem('agencyid'));
  })

  const [created, setCreated] = useState(false);
  const [error, setError] = useState(false);
  
    async function addData () {
      try {
        const sex = sexOfChildToAddRef.current.value.trim();
        const childAge = ageOfChildToAddRef.current.value.trim();

        const childName = nameOfChildToAddRef.current.value.trim();

        const geneticDisorder = genDisorderToAddRef.current.value.trim();

        const cid = childID.current.value.trim();

        const ads = 'inhouse';
        const dob = DOBAddToRef.current.value.trim();
        const doa = DOAAddToRef.current.value.trim();
        const DateofBirth = new Date(dob);
        const birth = DateofBirth.toISOString().split('T')[0];

        const dateObject = new Date(doa);
        const admitted = `${dateObject.getFullYear()}-${(dateObject.getMonth() + 1).toString().padStart(2, '0')}-${dateObject.getDate().toString().padStart(2, '0')} ${dateObject.getHours().toString().padStart(2, '0')}:${dateObject.getMinutes().toString().padStart(2, '0')}:${dateObject.getSeconds().toString().padStart(2, '0')}`;
        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cid: cid,
            sex: sex,
            doa: admitted,
            dob: birth,
            age: parseInt(childAge, 10),
            c_name: childName,
            genetic_disorder: geneticDisorder,
            adoption_status: ads,
            agencyid: agencyid,
          }),
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/agencyupdatechild`,
          postData
        );

        console.log("POST -- URL BEING USED:" + process.env.NEXT_PUBLIC_URL)
        if (!res.ok) {
          setError(true);
          console.log("in res not ok!");
          throw new Error(`API request failed with status ${res.status}`);
        }

        const response = await res.json();
        console.log("POST --- API Response:", response);
        if (response.message !== "success") {
          console.error("API Error:", response.message);
          return;
        }
        if (response.message === "success") {
          setCreated(true);
        }
      } catch (error) {
        console.error("POST -- Error fetching data:", error);
      }
      
    }
    
  return (
    <>
    <main className = {styles.mainBox}>
        <form className = {styles.formElement} onSubmit = {addData} method = 'POST'>
            <div className = {styles.formContainer}>
                <div className = {styles.headingContainer}>
                  <h1 className = {styles.h1}>Update Child Details</h1>
                  <p className = {styles.pTag}>Building relationships, one family at a time.</p>
                </div>
                <div className = {styles.inputsContainer}>
                    {/* Name of the child input */}
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "c_id">Registration ID of the child</label>
                        <p></p>
                        <input 
                        className = {styles.inputBox}
                        type = "number"
                        ref = {childID}
                        required
                        />
                    </div>
                <div className = {styles.inputsContainer}>
                    {/* Name of the child input */}
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "c_name">Name of the child</label>
                        <p></p>
                        <input 
                        className = {styles.inputBox}
                        type = "text"
                        ref = {nameOfChildToAddRef}
                        required
                        />
                    </div>
                    {/* Sex of the child input */}
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "sex">Sex of the child</label>
                        <p></p>
                        <input 
                        className = {styles.inputBox}
                        type="text"
                        ref = {sexOfChildToAddRef}
                        placeholder = "male / female" 
                        required
                        />
                    </div>
                    {/* Age of child input */}
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "age">Age of the child</label>
                        <p></p>
                        <input
                        className = {styles.inputBox}
                        type="number"
                        ref = {ageOfChildToAddRef}
                        placeholder = "Age of the child"
                        required
                        />
                    </div>
                    {/* Gen disorder input */}
                    <p className = {styles.radioLabel}htmlFor = "genetic_disorder">Genetic Disorders (If yes, please specify.)</p>
                    <div className = {styles.inputDivs}>
                        <p></p>
                        <input 
                        className = {styles.inputBox}
                        type="text"
                        ref = {genDisorderToAddRef}
                        placeholder = "None / fill it up" 
                        required
                        />
                    </div>
                    {/* Adoption status input */}
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "dob">Date of Birth</label>
                        <p></p>
                        <input
                        className = {styles.inputBox}
                        type="text"
                        ref = {DOBAddToRef}
                        placeholder = "Date of birth"
                        required
                        />
                    </div>
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "doa">Date of Admittance</label>
                        <p></p>
                        <input
                        className = {styles.inputBox}
                        type="text"
                        ref = {DOAAddToRef}
                        placeholder = "Date of Admittance"
                        required
                        />
                    </div>
                    <div className = {styles.inputDivs}>
                        <label htmlFor = "adstat">Adoption Status</label>
                        <p></p>
                        <input
                        className = {styles.inputBox}
                        type="text"
                        ref = {Adstat}
                        placeholder = "Adoption Status"
                        required
                        />
                    </div>
                </div>

            <div className = {styles.saveButton}>
              <input
                  value = "Save"
                  type = "button"
                  onClick = {addData}
                />
            </div>
            {created && <div className={styles.successMsg}>Success!</div>}
            {error && <div className={styles.errorMsg}>Error: Login or Use a different ID</div>}
            </div>
            <div className = {styles.formImage}>
              <Image src = {formImage} alt = 'Family Form Image'/>
            </div>
            </div>
        </form>
      </main>
    </>
  );
};

export default Agency;