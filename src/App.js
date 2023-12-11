import { Playground, store } from "graphql-playground-react";
import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore/lite";
const firebaseConfig = {
  apiKey: "AIzaSyA53ODWCzicLcd3tDeXHnjZA-hAY2cXZdg",
  authDomain: "grapqhlist.firebaseapp.com",
  projectId: "grapqhlist",
  storageBucket: "grapqhlist.appspot.com",
  messagingSenderId: "500518753639",
  appId: "1:500518753639:web:06b31c36f1a9123d29cbc2",
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const collectionName = "projects";
async function getProjects() {
  const projectsCol = collection(db, collectionName);
  const projects = await getDocs(projectsCol);
  const list = projects.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
  });
  return list;
}
function App() {
  const [project, setProject] = useState(undefined);
  const [projects, setProjets] = useState([]);
  const [showForm, setShowform] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    key: "",
    schema: "",
  });

  useEffect(() => {
    const setList = async () => {
      const list = await getProjects();
      console.log(list);
      setProjets(list);
    };
    setList();
  }, []);

  useEffect(() => {
    if (project) {
      const hh = setTimeout(() => {
        document.getElementsByClassName("iRmVrA")?.[0]?.click();
        return clearTimeout(hh);
      }, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const handleSetProject = (project) => {
    console.log(project);
    setProject(project);
  };

  const handleUpdateProject = (project) => {
    setProject(undefined);
    removeProject(project);
    setFormData(project);
    setShowform(true);
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!formData.name) return;
    if (!formData.url) return;
    if (!formData.key) return;
    if (!formData.schema) return;
    if (formData.id) await deleteDoc(doc(db, collectionName, formData.id));
    setProjets([...projects, formData]);
    setShowform(() => false);
    handleSetProject(formData);
    await addDoc(collection(db, collectionName), {
      ...formData,
    });
    setFormData(() => ({
      name: "",
      url: "",
      key: "",
      schema: "",
    }));
  };

  const removeProject = (project) => {
    deleteDoc(doc(db, collectionName, project.id));
    const updated = projects.filter((e) => e.name !== project.name);
    setProjets(updated);
  };

  return project ? (
    <>
      <div
        class="project-select"
        onClick={() => {
          setProject(undefined);
        }}
      >
        {project.name || "Projekt liste"}
      </div>

      <div
        class="project-update"
        onClick={() => {
          handleUpdateProject(project);
        }}
      >
        Update
      </div>

      <Provider store={store}>
        <Playground
          endpoint={project.url}
          endpointUrl={project.url}
          activeProjectName={project.name}
          fixedEndpoint={project.url}
          activeEnv={{
            "x-api-key": project.key,
          }}
          schema={JSON.parse(project.schema).data}
          headers={{
            "x-api-key": project.key,
          }}
          settings={{
            "tracing.hideTracingResponse": false,
            "tracing.tracingSupported": false,
            "schema.polling.enable": false,
            "schema.enablePolling": false,
          }}
          injectedState={{
            activeEnv: project.name,
          }}
          isElectron={true}
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
            <label>Url</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  url: value,
                }));
              }}
              value={formData.url}
            />
            <label>Key</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  key: value,
                }));
              }}
              value={formData.key}
            />
            <label>Schema</label>
            <input
              onChange={(evt) => {
                const { value } = evt.target;
                setFormData((s) => ({
                  ...s,
                  schema: value,
                }));
              }}
              value={formData.schema}
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
                  key={e.name}
                  class="project list-item"
                  onClick={() => handleSetProject(e)}
                >
                  {e.name}
                  <div
                    class="remove"
                    onClick={(evt) => {
                      evt.stopPropagation();
                      removeProject(e);
                    }}
                  >
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
