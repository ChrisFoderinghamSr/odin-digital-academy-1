"use client";

import { FormEvent, useState } from "react";

const gradeLevels = [
  "Toddler",
  "Pre-K 4",
  "Pre-K 5",
  "Kindergarten",
  "1st Grade",
  "2nd Grade",
  "3rd Grade",
  "4th Grade",
  "5th Grade",
];

const subjects = [
  "Mathematics",
  "Reading & Literature",
  "Writing",
  "Science",
  "Social Studies",
  "Technology",
  "Financial Literacy",
  "Life Skills",
  "Character & Leadership",
  "Creative Arts",
  "Physical Education",
  "Digital Citizenship",
];

const semesters = ["Semester 1", "Semester 2"];

const sampleUnits = [
  {
    number: "01",
    title: "Number Sense & Place Value",
    weeks: 4,
    lessons: 8,
    status: "Published",
  },
  {
    number: "02",
    title: "Multiplication Strategies",
    weeks: 3,
    lessons: 7,
    status: "Published",
  },
  {
    number: "03",
    title: "Division & Problem Solving",
    weeks: 4,
    lessons: 9,
    status: "Draft",
  },
];

export default function CurriculumManager() {
  const [grade, setGrade] = useState("5th Grade");
  const [subject, setSubject] = useState("Mathematics");
  const [semester, setSemester] = useState("Semester 1");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [message, setMessage] = useState("");

  function handleCreateCurriculum(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage(
      `Curriculum draft created for ${grade} ${subject} - ${semester}.`
    );

    setShowCreateForm(false);
  }

  return (
    <div className="curriculum-manager">
      <div className="curriculum-toolbar">
        <div>
          <span className="norse-eyebrow">
            ACADEMIC CONTENT MANAGEMENT
          </span>

          <h2>Curriculum Manager</h2>

          <p>
            Build, organize, review, and publish curriculum for
            every Academy grade level.
          </p>
        </div>

        <button
          type="button"
          className="button button-gold"
          onClick={() => setShowCreateForm(true)}
        >
          + Create Curriculum
        </button>
      </div>

      {message && (
        <div className="curriculum-success" role="status">
          {message}
        </div>
      )}

      <section className="curriculum-filters">
        <label>
          Academic Year
          <select defaultValue="2026-2027">
            <option>2026-2027</option>
            <option>2027-2028</option>
          </select>
        </label>

        <label>
          Grade Level
          <select
            value={grade}
            onChange={(event) => setGrade(event.target.value)}
          >
            {gradeLevels.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Subject
          <select
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
          >
            {subjects.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Semester
          <select
            value={semester}
            onChange={(event) =>
              setSemester(event.target.value)
            }
          >
            {semesters.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
      </section>

      {showCreateForm && (
        <section className="curriculum-form-card">
          <div className="curriculum-form-header">
            <div>
              <span className="section-label">
                NEW CURRICULUM
              </span>

              <h3>Create Curriculum</h3>
            </div>

            <button
              type="button"
              className="curriculum-close-button"
              onClick={() => setShowCreateForm(false)}
              aria-label="Close curriculum form"
            >
              ×
            </button>
          </div>

          <form
            className="academy-form"
            onSubmit={handleCreateCurriculum}
          >
            <div className="form-row">
              <label>
                Curriculum Title
                <input
                  name="title"
                  placeholder="Grade 5 Mathematics"
                  required
                />
              </label>

              <label>
                Course Code
                <input
                  name="courseCode"
                  placeholder="MATH-05-S1"
                  required
                />
              </label>
            </div>

            <label>
              Curriculum Description
              <textarea
                name="description"
                rows={4}
                placeholder="Describe the academic purpose and scope of this curriculum."
              />
            </label>

            <div className="form-row">
              <label>
                Grade Level
                <select defaultValue={grade}>
                  {gradeLevels.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Semester
                <select defaultValue={semester}>
                  {semesters.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="curriculum-form-actions">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setShowCreateForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="button button-gold"
              >
                Save Curriculum Draft
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="curriculum-overview">
        <div className="curriculum-overview-header">
          <div>
            <span>{grade}</span>
            <h3>{subject}</h3>
            <small>{semester} • 2026–2027</small>
          </div>

          <span className="curriculum-status">
            ACTIVE
          </span>
        </div>

        <div className="curriculum-unit-list">
          {sampleUnits.map((unit) => (
            <article
              className="curriculum-unit"
              key={unit.number}
            >
              <div className="curriculum-unit-number">
                {unit.number}
              </div>

              <div className="curriculum-unit-content">
                <span>LEARNING UNIT</span>
                <h4>{unit.title}</h4>

                <div className="curriculum-unit-meta">
                  <small>{unit.weeks} weeks</small>
                  <small>{unit.lessons} lessons</small>
                  <small>{unit.status}</small>
                </div>
              </div>

              <button
                type="button"
                className="curriculum-view-button"
              >
                Manage →
              </button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}