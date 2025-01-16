import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus } from 'lucide-react'
import Header from "@/components/ui/Header"
import { registerUser } from '@/auth/user-registration'
import { useNavigate } from "react-router-dom";


function RegistrationForm() {
  const [step, setStep] = useState(1)
  const [userType, setUserType] = useState('')
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    email: '',
    password: '',
    dataDiNascita: '',
    genere: '',
    titoloDiStudio: '',
    competenze: '',
    occupazione: '',
    cv: null,
    userType: '',
    availability: null,
  })
  const [portfolioProjects, setPortfolioProjects] = useState([])
  const [newProject, setNewProject] = useState({ name: '', description: '', url: '' })
  const [showPortfolioForm, setShowPortfolioForm] = useState(false)
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null); // Tipo di feedback (successo o errore)
  const [errors, setErrors] = useState({})

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

const [selectedFile, setSelectedFile] = useState(null);
const handleFileChange = (event) => {
  const file = event.target.files[0];
  setSelectedFile(file); // Aggiorna lo stato con il file selezionato
};
  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      setPortfolioProjects(prev => [...prev, { ...newProject, id: Date.now().toString() }]);
      setNewProject({ name: '', description: '', url: '' });
    }
  };

  const handleRemoveProject = (id) => {
    setPortfolioProjects(prev => prev.filter(project => project.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.nome) newErrors.nome = 'Nome è obbligatorio';
      if (!formData.cognome) newErrors.cognome = 'Cognome è obbligatorio';
      if (!formData.email) newErrors.email = 'Email è obbligatorio';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email non valido';
      if (!formData.password) newErrors.password = 'Password è obbligatorio';
      if (!formData.dataDiNascita) newErrors.dataDiNascita = 'Data di nascita è obbligatorio';
      if (!formData.genere) newErrors.genere = 'Genere è obbligatorio';
    } else if (step === 2) {
      if (!formData.userType) newErrors.userType = 'Tipo di utente è obbligatorio';
      if (!formData.titoloDiStudio) newErrors.titoloDiStudio = 'Titolo di studio è obbligatorio';
      if (!formData.competenze) newErrors.competenze = 'Competenze sono obbligatorie';
      if (formData.userType === "mentor") {
      if (!formData.occupazione) newErrors.occupazione = "Il Settore IT è obbligatorio"
        if (
          !formData.availability ||
          formData.availability < 1 ||
          formData.availability > 10
        ) {
          newErrors.availability = "Seleziona una disponibilità valida (1-10 ore)";
        }
      } else if (formData.userType === "mentee") {
        if (!formData.field) {
          newErrors.field = "Campo di interesse è obbligatorio per i Mentee";
        }
      }
    }
    

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    try {
      // Passa il formData con il file CV e gli altri dati
      const response = await registerUser(
        {
          ...formData,
          cv: selectedFile, // Include il file selezionato
          availability: formData.userType === "mentor" ? formData.availability : null,
          field: formData.userType === "mentee" ? formData.field : null, // Include il campo di interesse per i Mentee
        },
        portfolioProjects
      );
      
  
      if (response.success) {
        setFeedbackMessage(
          "Registrazione completata con successo. Verrai reindirizzato alla Home page tra 3 secondi."
        );
        setFeedbackType("success");
  
        // Reindirizza alla pagina di login dopo 3 secondi
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error("Errore durante la registrazione:", err.message);
      setFeedbackMessage(
        err.message || "Errore durante la registrazione. Per favore riprova."
      );
      setFeedbackType("error");
    }
  };
  
  


  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
        <Header />
        <div className="mt-8"></div>
        <Card className="mx-auto max-w-2xl border-[#178563] border-2 bg-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-[#178563]">Registrazione Mentore o Mentee</CardTitle>
            <CardDescription>Compila il form per registrarti come Mentore o Mentee</CardDescription>
          </CardHeader>
          <CardContent>
            {feedbackMessage && (
              <div
                className={`flex items-center gap-4 p-4 mb-4 text-sm rounded-lg shadow-md transition-transform transform ${feedbackType === "success"
                    ? "bg-green-50 text-green-800 border border-green-300"
                    : "bg-red-50 text-red-800 border border-red-300"
                  }`}
                role="alert"
              >
                <span
                  className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full ${feedbackType === "success" ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                    }`}
                >
                  {feedbackType === "success" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636l-1.414 1.414M5.636 18.364l-1.414-1.414M12 3v18m9-9H3"
                      />
                    </svg>
                  )}
                </span>
                <span className="flex-grow">{feedbackMessage}</span>
                <button
                  type="button"
                  onClick={() => setFeedbackMessage(null)}
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nome">Nome</Label>
                      <Input
                        id="nome"
                        name="nome"
                        required
                        value={formData.nome}
                        onChange={handleInputChange}
                        className="focus:ring-[#178563] focus:border-[#178563]"
                        aria-invalid={errors.nome ? "true" : "false"}
                        aria-describedby={errors.nome ? "nome-error" : undefined}
                      />
                      {errors.nome && <p id="nome-error" className="text-red-500 text-sm">{errors.nome}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cognome">Cognome</Label>
                      <Input
                        id="cognome"
                        name="cognome"
                        required
                        value={formData.cognome}
                        onChange={handleInputChange}
                        className="focus:ring-[#178563] focus:border-[#178563]"
                        aria-invalid={errors.cognome ? "true" : "false"}
                        aria-describedby={errors.cognome ? "cognome-error" : undefined}
                      />
                      {errors.cognome && <p id="cognome-error" className="text-red-500 text-sm">{errors.cognome}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                    {errors.email && <p id="email-error" className="text-red-500 text-sm">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.password ? "true" : "false"}
                      aria-describedby={errors.password ? "password-error" : undefined}
                    />
                    {errors.password && <p id="password-error" className="text-red-500 text-sm">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dataDiNascita">Data di Nascita</Label>
                    <Input
                      id="dataDiNascita"
                      name="dataDiNascita"
                      type="date"
                      required
                      value={formData.dataDiNascita}
                      onChange={handleInputChange}
                      className="focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.dataDiNascita ? "true" : "false"}
                      aria-describedby={errors.dataDiNascita ? "dataDiNascita-error" : undefined}
                    />
                    {errors.dataDiNascita && <p id="dataDiNascita-error" className="text-red-500 text-sm">{errors.dataDiNascita}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="genere">Genere</Label>
                    <RadioGroup
                      value={formData.genere}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, genere: value }))}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="maschio" id="maschio" />
                        <Label htmlFor="maschio">Maschio</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="femmina" id="femmina" />
                        <Label htmlFor="femmina">Femmina</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="altro" id="altro" />
                        <Label htmlFor="altro">Altro</Label>
                      </div>
                    </RadioGroup>
                    {errors.genere && <p id="genere-error" className="text-red-500 text-sm">{errors.genere}</p>}
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="titoloDiStudio">Titolo di Studio</Label>
                    <Select
                      value={formData.titoloDiStudio}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, titoloDiStudio: value }))}
                    >
                      <SelectTrigger id="titoloDiStudio">
                        <SelectValue placeholder="Seleziona il tuo titolo di studio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="diploma">Diploma</SelectItem>
                        <SelectItem value="laurea">Laurea</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                        <SelectItem value="dottorato">Dottorato</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.titoloDiStudio &&
                      <p id="titoloDiStudio-error" className="text-red-500 text-sm">{errors.titoloDiStudio}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="competenze">Competenze</Label>
                    <Textarea
                      id="competenze"
                      name="competenze"
                      value={formData.competenze}
                      onChange={handleInputChange}
                      placeholder="Inserisci le tue competenze"
                      className="min-h-[120px] focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.competenze ? "true" : "false"}
                      aria-describedby={errors.competenze ? "competenze-error" : undefined}
                    />
                    {errors.competenze && <p id="competenze-error" className="text-red-500 text-sm">{errors.competenze}</p>}
                  </div>
                  {userType === "mentor" && (
  <div>
    <Label htmlFor="occupazione">Settore IT</Label>
    <Select
      value={formData.occupazione}
      onValueChange={(value) =>
        setFormData((prev) => ({ ...prev, occupazione: value }))
      }
    >
      <SelectTrigger id="occupazione">
        <SelectValue placeholder="Seleziona la tua occupazione" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="software-development">Sviluppo Software</SelectItem>
        <SelectItem value="web-development">Sviluppo Web</SelectItem>
        <SelectItem value="mobile-development">Sviluppo Mobile</SelectItem>
        <SelectItem value="data-science">Data Science</SelectItem>
        <SelectItem value="machine-learning">Machine Learning</SelectItem>
        <SelectItem value="artificial-intelligence">
          Intelligenza Artificiale
        </SelectItem>
        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
        <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
        <SelectItem value="networking">Networking</SelectItem>
        <SelectItem value="devops">DevOps</SelectItem>
        <SelectItem value="blockchain">Blockchain</SelectItem>
        <SelectItem value="game-development">Sviluppo Videogiochi</SelectItem>
        <SelectItem value="it-support">Supporto IT</SelectItem>
        <SelectItem value="ui-ux-design">Design UI/UX</SelectItem>
        <SelectItem value="software-testing">Testing Software</SelectItem>
        <SelectItem value="database-administration">
          Amministrazione Database
        </SelectItem>
        <SelectItem value="robotics">Robotica</SelectItem>
        <SelectItem value="iot">Internet of Things (IoT)</SelectItem>
        <SelectItem value="digital-transformation">
          Trasformazione Digitale
        </SelectItem>
        <SelectItem value="big-data">Big Data</SelectItem>
      </SelectContent>
    </Select>
    {errors.occupazione && (
      <p id="occupazione-error" className="text-red-500 text-sm">
        {errors.occupazione}
      </p>
    )}
  </div>
)}


{userType === "mentee" && (
  <div>
    <Label htmlFor="field">Campo di Interesse</Label>
    <Select
      value={formData.field}
      onValueChange={(value) =>
        setFormData((prev) => ({ ...prev, field: value }))
      }
    >
      <SelectTrigger id="field">
        <SelectValue placeholder="Seleziona il tuo campo di interesse" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="software-development">Sviluppo Software</SelectItem>
        <SelectItem value="web-development">Sviluppo Web</SelectItem>
        <SelectItem value="mobile-development">Sviluppo Mobile</SelectItem>
        <SelectItem value="data-science">Data Science</SelectItem>
        <SelectItem value="machine-learning">Machine Learning</SelectItem>
        <SelectItem value="artificial-intelligence">
          Intelligenza Artificiale
        </SelectItem>
        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
        <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
        <SelectItem value="networking">Networking</SelectItem>
        <SelectItem value="devops">DevOps</SelectItem>
        <SelectItem value="blockchain">Blockchain</SelectItem>
        <SelectItem value="game-development">Sviluppo Videogiochi</SelectItem>
        <SelectItem value="it-support">Supporto IT</SelectItem>
        <SelectItem value="ui-ux-design">Design UI/UX</SelectItem>
        <SelectItem value="software-testing">Testing Software</SelectItem>
        <SelectItem value="database-administration">
          Amministrazione Database
        </SelectItem>
        <SelectItem value="robotics">Robotica</SelectItem>
        <SelectItem value="iot">Internet of Things (IoT)</SelectItem>
        <SelectItem value="digital-transformation">
          Trasformazione Digitale
        </SelectItem>
        <SelectItem value="big-data">Big Data</SelectItem>
      </SelectContent>
    </Select>
    {errors.field && (
      <p id="field-error" className="text-red-500 text-sm">
        {errors.field}
      </p>
    )}
  </div>
)}


                  {userType === "mentor" && (
                    <div className="space-y-2">
                      <Label>Disponibilità (ore settimanali)</Label>
                      <div className="mt-2 flex space-x-2">
                        {[...Array(10)].map((_, i) => (
                          <Button
                            key={i}
                            type="button" // Aggiunto per impedire il comportamento di submit
                            variant={formData.availability === i + 1 ? "default" : "outline"}
                            className={`h-8 w-8 p-0 ${formData.availability === i + 1 ? "bg-emerald-600" : ""
                              }`}
                            onClick={() =>
                              setFormData((prev) => ({ ...prev, availability: i + 1 }))
                            }
                          >
                            {i + 1}
                          </Button>

                        ))}
                      </div>
                      {errors.availability && (
                        <p className="text-red-500 text-sm">{errors.availability}</p>
                      )}
                    </div>
                  )}

{userType === "mentor" && (
  <div>
    {/* Stringa impiego per i mentor */}
    <Label htmlFor="impiego">Impiego</Label>
    <input
      type="text"
      id="impiego"
      value={formData.impiego}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, impiego: e.target.value }))
      }
      placeholder="Inserisci il tuo impiego"
      className="border border-gray-300 rounded px-2 py-1 w-full"
    />
    {errors.impiego && (
      <p id="impiego-error" className="text-red-500 text-sm">
        {errors.impiego}
      </p>
    )}
  </div>
)}




{userType === "mentor" && (
  <>
    <div className="space-y-2">
      <Label htmlFor="meetingMode">Modalità di incontro</Label>
      <Select
        value={formData.meetingMode || ''} // Fallback a stringa vuota per evitare il warning di React
        onValueChange={(value) =>
          setFormData((prev) => ({ ...prev, meetingMode: value }))
        }
      >
        <SelectTrigger id="meetingMode">
          <SelectValue placeholder="Seleziona la modalità di incontro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="online">Online</SelectItem>
          <SelectItem value="in-person">Di persona</SelectItem>
          <SelectItem value="hybrid">Ibrida</SelectItem>
        </SelectContent>
      </Select>
      {errors.meetingMode && (
        <p id="meetingMode-error" className="text-red-500 text-sm">
          {errors.meetingMode}
        </p>
      )}
    </div>
  </>
)}






                  <div className="space-y-2">
                    <Label htmlFor="userType">Tipo di Utente</Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={(value) => {
                        setUserType(value)
                        setFormData(prev => ({ ...prev, userType: value }))
                      }}
                      className="flex items-center gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mentee" id="mentee" />
                        <Label htmlFor="mentee">Mentee</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mentor" id="mentor" />
                        <Label htmlFor="mentor">Mentore</Label>
                      </div>
                    </RadioGroup>
                    {errors.userType && <p id="userType-error" className="text-red-500 text-sm">{errors.userType}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cv">CV (opzionale)</Label>
                    <Input
                      id="cv"
                      name="cv"
                      type="file"
                      onChange={handleFileChange}
                      className="w-full cursor-pointer file:bg-emerald-50 file:text-emerald-600 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-emerald-100 focus:ring-[#178563] focus:border-[#178563] mb-6"
                      style={{ paddingTop: '15px', paddingBottom: '48px' }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Portfolio (opzionale)</Label>
                    {portfolioProjects.map(project => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <p>{project.name}</p>
                          <p>{project.description}</p>
                          {project.url && <a href={project.url} target="_blank" rel="noopener noreferrer">{project.url}</a>}
                        </div>
                        <Button variant="ghost" onClick={() => handleRemoveProject(project.id)} className="text-red-500">
                          <X size={16} />
                        </Button>
                      </div>
                    ))}
                    {showPortfolioForm ? (
                      <div className="flex gap-2">
                        <Input placeholder="Nome del progetto" value={newProject.name} onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))} />
                        <Input placeholder="Descrizione del progetto" value={newProject.description} onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))} />
                        <Input placeholder="URL del progetto (opzionale)" value={newProject.url} onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))} />
                        <Button type = "button" onClick={handleAddProject} className="bg-[#178563] text-white hover:bg-[#178563]/90">
                          <Plus size={16} />
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={() => setShowPortfolioForm(true)} variant="outline" className="w-full border-dashed text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600">
                        + Aggiungi al Portfolio
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(prev => prev - 1)}
                className="border-[#178563] text-[#178563] hover:bg-[#178563] hover:text-white"
              >
                Indietro
              </Button>
            )}
            {step < 2 ? (
              <Button
                type="button"
                className="bg-[#178563] text-white hover:bg-[#178563]/90"
                onClick={() => {
                  if (validateForm()) setStep(prev => prev + 1)
                }}
              >
                Avanti
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-[#178563] text-white hover:bg-[#178563]/90"
                onClick={handleSubmit}
              >
                Registrati
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </>
  )
}

export default RegistrationForm