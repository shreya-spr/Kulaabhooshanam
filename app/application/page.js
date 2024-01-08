"use client"

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NextResponse } from "next/server";
import Image from 'next/image';
import formImage from "../../public/formImages.jpg"
import styles from "../../styles/forms.module.css";

const Application = () => {
  const router = useRouter();
  const parentIDToAddRef = useRef();
  const sexOfChildToAddRef = useRef();
  const ageOfChildToAddRef = useRef();
  const genDisorderToAddRef = useRef();

  const [created, setCreated] = useState(false);
  const [error, setError] = useState(false);

    async function addData () {
      try {
        const sex = sexOfChildToAddRef.current.value.trim();
        const childAge = ageOfChildToAddRef.current.value.trim();
        const parentID = parentIDToAddRef.current.value.trim();
        const geneticDisorder = genDisorderToAddRef.current.value.trim();

        const postData = {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sex: sex,
            child_age: parseInt(childAge, 10),
            p_id: parentID, 
            g_disorder: geneticDisorder,
          }),
        };
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_URL}/api/application`,
          postData
        );

        console.log("POST -- URL BEING USED:" + process.env.NEXT_PUBLIC_URL)
        if (!res.ok) {
          setError(true);
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

    const onProfileClick = () => {
      console.log("profile button clicked")
      router.push("/profile")
    }
    
  return (
    <>
    
    <main className = {styles.mainBox}>
        <form className = {styles.formElement} onSubmit = {addData} method = 'POST'>
            <div className = {styles.formContainer}>
                <div className = {styles.headingContainer}>
                  <h1 className = {styles.h1}>Apply for Adoption</h1>
                  <p className = {styles.pTag}>Building relationships, one family at a time.</p>
                </div>

                <div className={styles.inputsContainer}>
                  <div>
                    {/* Id of parents */}
                    <div className={styles.inputDivs}>
                        <label htmlFor="p_id">Enter your ID(Aadhar Number)</label>
                        <p></p>
                        <input 
                        className={styles.inputBox}
                        type="text"
                        // name="p_id"
                        ref={parentIDToAddRef}
                        placeholder="4222 2224 4222"
                        required
                        pattern='[2-9]{1}[0-9]{3}\\s[0-9]{4}\\s[0-9]{4}'
                        />
                    </div>
                    {/* Sex of the child input */}
                    <div className={styles.inputDivs}>
                        <label htmlFor="sex">Sex of the child</label>
                        <p></p>
                        <input 
                        className={styles.inputBox}
                        type="text"
                        // name="Sex"
                        ref={sexOfChildToAddRef}
                        placeholder="male / female" 
                        required
                        />
                    </div>
                    {/* Age of child input */}
                    <div className={styles.inputDivs}>
                        <label htmlFor="child_age">Age of the child</label>
                        <p></p>
                        <input
                        className={styles.inputBox}
                        type="number"
                        // name="child_age"
                        ref={ageOfChildToAddRef}
                        placeholder="Age of the child"
                        required
                        />
                    </div>
                    {/* Gen disorder radio */}
                    <p className={styles.radioLabel}htmlFor="g_disorder">Are you okay if the child has a genetic disorder?</p>
                    <div className={styles.radioDivs}>
                        <p></p>
                        <input 
                        id="yes"
                        type="radio"
                        // name="g_disorder"
                        ref={genDisorderToAddRef}
                        value="Yes"
                        required
                        onChange={() => {
                          // Disable the "No" radio button when "Yes" is selected
                          document.getElementById("no").disabled = true;
                        }}
                        />
                        <label htmlFor="yes">Yes</label>
                        <p></p>
                        <input  
                        id="no"
                        type="radio"
                        // name="g_disorder"
                        ref={genDisorderToAddRef}
                        value="No"
                        required
                        onChange={() => {
                          // Disable the "Yes" radio button when "No" is selected
                          document.getElementById("yes").disabled = true;
                        }}
                        />
                        <label htmlFor="no">No</label>
                    </div>
                </div>
            <div className={styles.saveButton}>
              <input
                  value="Save"
                  type="button"
                  onClick={addData}
                />
            </div>
            {created && <div className={styles.successMsg}>Success!</div>}
            {error && <div className={styles.errorMsg}>Error: Login or Use a different ID</div>}
            </div>
            </div>
            <div className={styles.formImage}>
              <Image src = {formImage} alt = 'Family Form Image'/>
            </div>
        </form>

        <div className={styles.profileBtn}>
          <button onClick={() => onProfileClick()}>Proceed to profile</button>
        </div>
      </main>
    </>
  );
};

export default Application;
