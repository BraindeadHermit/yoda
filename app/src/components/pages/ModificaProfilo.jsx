import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { X, Plus, Download } from 'lucide-react'
import Header from "@/components/ui/Header"
import {  updateUserProfileWithCV, getUserByID } from '@/dao/userDAO'
import { useNavigate } from "react-router-dom";
import { useAuth } from '@/auth/auth-context'


function ModificaProfilo() {
  // Variabili di stato per gestire il curriculum, il portfolio, i messaggi di feedback
  const [oldCV, setOldCV] = useState(null);
  const [portfolioProjects, setPortfolioProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', description: '', url: '' });
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [feedbackType, setFeedbackType] = useState(null); // Feedback type: success or error
  const [errors, setErrors] = useState({});

  // Context di autenticazione per prendere l'ID e il tipo di utente(mentor/mentee)
  const { userId, userType } = useAuth();

  // Funzioni per gestire quale form visualizzare e i dati del primo form
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: '',
    cognome: '',
    genere: '',
    titoloDiStudio: '',
    competenze: '',
    occupazione: '',
    cv: null,
    availability: null,
  });
  const [selectedFile, setSelectedFile] = useState(null);

  // Funzione per la navigazione
  const navigate = useNavigate();

  // Prende i dati dall'utente e popola il form con i valori correnti
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserByID(userId);

        // Popola il CV e il portfolio
        if (userData.cv) setOldCV(userData.cv);
        if (userData.portfolioProjects) setPortfolioProjects(userData.portfolioProjects);
        console.log("Dati utente: ");
        console.dir(userData)

        // Inizializza i dati del form con campi comuni
        const initialData = {
          nome: userData.nome || '',
          cognome: userData.cognome || '',
          email: userData.email || '',
          dataNascita: userData.dataNascita || '',
          genere: userData.sesso || '',
          titoloDiStudio: userData.titoloDiStudio || '',
          competenze: userData.competenze || '',
          cv: userData.cv || null,
          portfolioProjects: userData.portfolioProjects || [],
        };

        // Aggiunge campi specifici in base al ruolo(tipo) dell'utente
        if (userType === 'mentee') {
          initialData.field = userData.field || '';
        } else if (userType === 'mentor') {
          initialData.settoreIT = userData.occupazione || '';
          initialData.availability = userData.availability || null;
          initialData.occupazione = userData.impiego || '';
          initialData.meetingMode = userData.meetingMode || '';
        }

        setFormData(initialData);
      } catch (error) {
        console.error('Errore durante il recupero del profilo:', error.message);
        setFeedbackMessage('Errore nel caricamento dei dati utente.');
        setFeedbackType('error');
      }
    };

    fetchUserProfile();
  }, [userId, userType]);

  // Gestisce i cambiamenti dell'input del form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  // Gestisce la gestione del caricamento del CV
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // Aggiunge nuovo progetto al portfolio
  const handleAddProject = () => {
    if (newProject.name && newProject.description) {
      setPortfolioProjects((prev) => [...prev, { ...newProject, id: Date.now().toString() }]);
      setNewProject({ name: '', description: '', url: '' });
    }
  };

  // Rimuove progetto dal portfolio
  const handleRemoveProject = (id) => {
    setPortfolioProjects((prev) => prev.filter((project) => project.id !== id));
  };

  // Valida il form in base allo step corrente
  const validateForm = () => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.nome) newErrors.nome = 'Nome è obbligatorio';
      if (!formData.cognome) newErrors.cognome = 'Cognome è obbligatorio';
      if (!formData.genere) newErrors.genere = 'Genere è obbligatorio';
    } else if (step === 2) {
      if (!formData.titoloDiStudio) newErrors.titoloDiStudio = 'Titolo di studio è obbligatorio';
      if (!formData.competenze) newErrors.competenze = 'Competenze sono obbligatorie';

      if (userType === 'mentor') {
        if (!formData.availability || formData.availability < 1 || formData.availability > 10) {
          newErrors.availability = 'Seleziona una disponibilità valida (1-10 ore)';
        }
      } else if (userType === 'mentee') {
        if (!formData.field) {
          newErrors.field = 'Campo di interesse è obbligatorio per i Mentee';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Gestisce invio del form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    console.log("[ModificaProfilo] PortfolioProjects = ");
    console.log(portfolioProjects);
    portfolioProjects.forEach((progetto) => {console.log(`progetto: ${progetto}`)});
    try {
      const submissionData = {
        ...formData,
        cv: selectedFile,
        impiego: userType === 'mentor' ? formData.occupazione : null,
        availability: userType === 'mentor' ? formData.availability : null,
        occupazione: userType === 'mentor' ? formData.settoreIT : null,
        field: userType === 'mentee' ? formData.field : null,
        portfolioProjects: portfolioProjects,
      };
      console.log("[ModificaProfilo] Sto per inviare a updateUserWithCV i seguenti dati: ")
      console.dir(submissionData);
      const response = await updateUserProfileWithCV(userId, submissionData);

      if (response.success) {
        setFeedbackMessage('Modifica completata con successo. Verrai reindirizzato alla Home page tra 3 secondi.');
        setFeedbackType('success');

        setTimeout(() => {
          navigate('/HomePageUtente');
        }, 3000);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('Errore durante la modifica:', err.message);
      setFeedbackMessage(err.message || 'Errore durante la modifica. Per favore riprova.');
      setFeedbackType('error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#178563] to-white text-black">
      <Header />
      <div className="mt-8"></div>
      <Card className="mx-auto max-w-2xl border-[#178563] border-2 bg-white backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-[#178563]">Modifica Profilo</CardTitle>
          <CardDescription>Compila il form per Modificare come {userType}</CardDescription> {/*Intestazione del form*/}
        </CardHeader>
        <CardContent>

          {/*Messaggi di feedback*/}
          {feedbackMessage && (
            <div
              className={`flex items-center gap-4 p-4 mb-4 text-sm rounded-lg shadow-md transition-transform transform ${feedbackType === 'success' ? 'bg-green-50 text-green-800 border border-green-300' : 'bg-red-50 text-red-800 border border-red-300'}`}
              role="alert"
            >
              <span
                className={`flex-shrink-0 inline-flex items-center justify-center w-8 h-8 rounded-full ${feedbackType === 'success' ? 'bg-green-200 text-green-700' : 'bg-red-200 text-red-700'}`}
              >
                {feedbackType === 'success' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-1.414 1.414M5.636 18.364l-1.414-1.414M12 3v18m9-9H3" />
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
            
            {/*Primo form (step = 1)*/}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/*Sezione del nome*/}
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      required
                      value={formData.nome}
                      onChange={handleInputChange}
                      className="focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.nome ? 'true' : 'false'}
                      aria-describedby={errors.nome ? 'nome-error' : undefined}
                    />
                    {errors.nome && <p id="nome-error" className="text-red-500 text-sm">{errors.nome}</p>}
                  </div>

                  {/*Sezione del cognome*/}
                  <div className="space-y-2">
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input
                      id="cognome"
                      name="cognome"
                      required
                      value={formData.cognome}
                      onChange={handleInputChange}
                      className="focus:ring-[#178563] focus:border-[#178563]"
                      aria-invalid={errors.cognome ? 'true' : 'false'}
                      aria-describedby={errors.cognome ? 'cognome-error' : undefined}
                    />
                    {errors.cognome && <p id="cognome-error" className="text-red-500 text-sm">{errors.cognome}</p>}
                  </div>
                </div>

                {/*Sezione del genere*/}
                <div className="space-y-2">
                  <Label htmlFor="genere">Genere</Label>
                  <RadioGroup
                    value={formData.genere}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, genere: value }))}
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

            {/*Secondo form (step = 2)*/}
            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {/*Sezione titolo di studio*/}
                  <Label htmlFor="titoloDiStudio">Titolo di Studio</Label>
                  <Select
                    value={formData.titoloDiStudio}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, titoloDiStudio: value }))}
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
                  {errors.titoloDiStudio && <p id="titoloDiStudio-error" className="text-red-500 text-sm">{errors.titoloDiStudio}</p>}
                </div>

                {/*Sezione competenze*/}
                <div className="space-y-2">
                  <Label htmlFor="competenze">Competenze</Label>
                  <Textarea
                    id="competenze"
                    name="competenze"
                    value={formData.competenze}
                    onChange={handleInputChange}
                    placeholder="Inserisci le tue competenze"
                    className="min-h-[120px] focus:ring-[#178563] focus:border-[#178563]"
                    aria-invalid={errors.competenze ? 'true' : 'false'}
                    aria-describedby={errors.competenze ? 'competenze-error' : undefined}
                  />
                  {errors.competenze && <p id="competenze-error" className="text-red-500 text-sm">{errors.competenze}</p>}
                </div>

                {/*Sezione campi per il mentore*/}
                {userType === 'mentor' && (
                  <div className="space-y-2">

                    {/*Sezione per l'occupazione*/}
                    <Label htmlFor="occupazione">Settore IT</Label>
                    <Select
                      value={formData.settoreIT}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, settoreIT: value }))}
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
                        <SelectItem value="artificial-intelligence">Intelligenza Artificiale</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="game-development">Sviluppo Videogiochi</SelectItem>
                        <SelectItem value="it-support">Supporto IT</SelectItem>
                        <SelectItem value="ui-ux-design">Design UI/UX</SelectItem>
                        <SelectItem value="software-testing">Testing Software</SelectItem>
                        <SelectItem value="database-administration">Amministrazione Database</SelectItem>
                        <SelectItem value="robotics">Robotica</SelectItem>
                        <SelectItem value="iot">Internet of Things (IoT)</SelectItem>
                        <SelectItem value="digital-transformation">Trasformazione Digitale</SelectItem>
                        <SelectItem value="big-data">Big Data</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.occupazione && <p id="occupazione-error" className="text-red-500 text-sm">{errors.occupazione}</p>}
                  </div>
                )}

                  {/*Campo disponibilità ore settimanali*/}
                  {userType === "mentor" && (
                  <div className="space-y-2">
                    <Label>Disponibilità (ore settimanali)</Label>
                    <div className="mt-2 flex space-x-2">
                      {[...Array(10)].map((_, i) => (
                        <Button
                          key={i}
                          type="button"
                          variant={formData.availability === i + 1 ? "default" : "outline"}
                          className={`h-8 w-8 p-0 ${formData.availability === i + 1 ? "bg-emerald-600" : ""}`}
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
                
                {/*Campo per l'impiego (occupazione)*/}
                {userType === "mentor" && (
                  <div>
                    <Label htmlFor="impiego">Impiego</Label>
                    <Input
                      type="text"
                      id="impiego"
                      value={formData.occupazione}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, occupazione: e.target.value }))
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

                {/*Campo modalità incontro*/}
                {userType === "mentor" && (
                  <div className="space-y-2">
                    <Label htmlFor="meetingMode">Modalità di incontro</Label>
                    <Select
                      value={formData.meetingMode || ""}
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
                )}

                {/*SEZIONI CAMPO DI INTERESSE PER IL MENTEE: 
                 
                 Sezione campo di interesse per il mentee*/}
                {userType === 'mentee' && (
                  <div className="space-y-2">
                    <Label htmlFor="field">Campo di Interesse</Label>
                    <Select
                      value={formData.field}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, field: value }))}
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
                        <SelectItem value="artificial-intelligence">Intelligenza Artificiale</SelectItem>
                        <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
                        <SelectItem value="cloud-computing">Cloud Computing</SelectItem>
                        <SelectItem value="networking">Networking</SelectItem>
                        <SelectItem value="devops">DevOps</SelectItem>
                        <SelectItem value="blockchain">Blockchain</SelectItem>
                        <SelectItem value="game-development">Sviluppo Videogiochi</SelectItem>
                        <SelectItem value="it-support">Supporto IT</SelectItem>
                        <SelectItem value="ui-ux-design">Design UI/UX</SelectItem>
                        <SelectItem value="software-testing">Testing Software</SelectItem>
                        <SelectItem value="database-administration">Amministrazione Database</SelectItem>
                        <SelectItem value="robotics">Robotica</SelectItem>
                        <SelectItem value="iot">Internet of Things (IoT)</SelectItem>
                        <SelectItem value="digital-transformation">Trasformazione Digitale</SelectItem>
                        <SelectItem value="big-data">Big Data</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.field && <p id="field-error" className="text-red-500 text-sm">{errors.field}</p>}
                  </div>
                )}
                {/*Campo per caricare il CV*/}
                <div className="space-y-2">
                  <Label htmlFor="cv">Carica nuovo CV</Label>
                  <Input
                    id="cv"
                    name="cv"
                    type="file"
                    onChange={handleFileChange}
                    className="w-full cursor-pointer file:bg-emerald-50 file:text-emerald-600 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:cursor-pointer hover:file:bg-emerald-100 focus:ring-[#178563] focus:border-[#178563] mb-6"
                    style={{ paddingTop: '15px', paddingBottom: '48px' }}
                  />
                  {oldCV && (
                    <div className="mt-6">
                      <h3 className="text-xl font-semibold mb-2">Curriculum</h3>
                      <div className="flex items-center space-x-2">
                        <Download className="text-[#178563]" />
                        <a
                          href={oldCV}
                          download
                          className="text-[#178563] underline hover:text-[#13674c] transition-all"
                        >
                          CV attuale - Scarica
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                
                {/*Campo per aggiornare il portfolio*/}
                <div className="space-y-2">
                  <Label>Portfolio (opzionale)</Label>
                  {portfolioProjects.map((project) => (
                    <div key={project.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <p>{project.name}</p>
                        <p>{project.description}</p>
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {project.url}
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        onClick={() => handleRemoveProject(project.id)}
                        className="text-red-500"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                  {showPortfolioForm ? (
                    <div className="flex gap-2">
                      <Input
                        placeholder="Nome del progetto"
                        value={newProject.name}
                        onChange={(e) =>
                          setNewProject((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="Descrizione del progetto"
                        value={newProject.description}
                        onChange={(e) =>
                          setNewProject((prev) => ({ ...prev, description: e.target.value }))
                        }
                      />
                      <Input
                        placeholder="URL del progetto (opzionale)"
                        value={newProject.url}
                        onChange={(e) =>
                          setNewProject((prev) => ({ ...prev, url: e.target.value }))
                        }
                      />
                      <Button id="plus"
                        type="button"
                        onClick={handleAddProject}
                        className="bg-[#178563] text-white hover:bg-[#178563]/90"
                      >
                        <Plus size={16} />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => setShowPortfolioForm(true)}
                      variant="outline"
                      className="w-full border-dashed text-emerald-600 hover:bg-emerald-50 hover:text-emerald-600"
                    >
                      + Aggiungi al Portfolio
                    </Button>
                  )}
                </div>
              </div>
            )}
          </form>
        </CardContent>
        {/*Bottone per andare indietro*/}
        <CardFooter className="flex justify-between">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => prev - 1)}
              className="border-[#178563] text-[#178563] hover:bg-[#178563] hover:text-white"
            >
              Indietro
            </Button>
          )}
          {/*Bottone per andare avanti*/}
          {step < 2 ? (
            <Button
              type="button"
              className="bg-[#178563] text-white hover:bg-[#178563]/90"
              onClick={() => {
                if (validateForm()) setStep((prev) => prev + 1);
              }}
            >
              Avanti
            </Button>
          ) : (
            <Button
              type="submit"       //Bottone per invio del form
              className="bg-[#178563] text-white hover:bg-[#178563]/90"
              onClick={handleSubmit}
            >
              Modifica
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}


export default ModificaProfilo