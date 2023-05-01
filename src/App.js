import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

const lsproject = "gqlp-project";
const lsprojects = "gqlp-projects";

function App() {
  const ps = localStorage.getItem(lsprojects);
  const [project, setProject] = useState(undefined);
  const [projects, setProjets] = useState(JSON.parse(ps) || []);
  const [showForm, setShowform] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    endpoint: "",
    headers: "",
  });

  useEffect(() => {
    const p = localStorage.getItem(lsproject);
    if (p) {
      setProject(JSON.parse(p));
    }
  }, []);

  const handleSetProject = (project) => {
    localStorage.setItem(lsproject, JSON.stringify(project));
    setProject(project);
  };

  const handleSubmit = (evt) => {
    evt.preventDefault();
    if (!formData.name) return;
    if (!formData.endpoint) return;
    localStorage.setItem(lsprojects, JSON.stringify([...projects, formData]));
    setFormData(() => ({
      name: "",
      endpoint: "",
      headers: "",
    }));
    setProjets([...projects, formData]);
    setShowform(() => false);
    setProject(formData);
  };

  const removeProject = (project) => {
    const updated = projects.filter((e) => e.name !== project.name);
    localStorage.setItem(lsprojects, JSON.stringify(updated));
    setProjets(updated);
  };

  const getHeader = (str) => {
    try {
      return JSON.parse(str);
    } catch (e) {
      return {};
    }
  };

  return project ? (
    <>
      <div
        class="project-select"
        onClick={() => {
          localStorage.removeItem(lsproject);
          setProject(undefined);
        }}
      >
        {project.name || 'Projekt liste'}
      </div>
      <Provider store={store}>
        <Playground
          activeProjectName={project.name}
          endpoint={project.endpoint}
          headers={getHeader(project.headers)}
        />
      </Provider>
    </>
  ) : (
    <div class="project-site">
      <div class="wrapper">
        {showForm ? (
          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  name: value,
                }));
              }}
              value={formData.name}
            />
            <label>Endpoint</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  endpoint: value,
                }));
              }}
              value={formData.endpoint}
            />
            <label>Headers</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  headers: value,
                }));
              }}
              value={formData.headers}
            />
            <button
              type="button"
              class="project cancel"
              onClick={() => setShowform(false)}
            >
              Afbryd
            </button>
            <button type="submit" class="project btn">
              Tilføj
            </button>
          </form>
        ) : (
          <>
            {projects &&
              projects.map((e) => (
                <div
                  class="project list-item"
                  onClick={() => handleSetProject(e)}
                >
                  {e.name}
                  <div class="remove" onClick={() => removeProject(e)}>
                    -
                  </div>
                </div>
              ))}

            <div class="project btn" onClick={() => setShowform(true)}>
              Tilføj nyt projekt
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;