"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/ui/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { registerUser } from "../../auth/user-registration"; // Import della funzione di registrazione

export default function RegistrationForm() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    email: "",
    password: "",
    dataNascita: "",
    genere: "",
  });

  const [error, setError] = useState(""); // Stato per errori
  const [successMessage, setSuccessMessage] = useState(""); // Stato per successi

  // Gestore di cambio input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Passaggio al passo successivo
  const handleNext = () => setStep(2);

  // Passaggio al passo precedente
  const handleBack = () => setStep(1);

  // Gestione della registrazione
  const handleRegister = async () => {
    setError(""); // Resetta gli errori
    setSuccessMessage(""); // Resetta il messaggio di successo

    // Chiamata alla funzione di registrazione
    const result = await registerUser(
      formData.nome,
      formData.cognome,
      formData.email,
      formData.password,
      formData.genere,
      formData.dataNascita
    );

    // Verifica del risultato della registrazione
    if (result.success) {
      setSuccessMessage("Registrazione effettuata con successo! Benvenuto!");
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-600 to-emerald-100">
      {/* Header */}
      <Header/>

      {/* Registration Form */}
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-emerald-600">
              Registrazione Mentore o Mentee
            </CardTitle>
            <p className="text-gray-500 text-sm">
              Compila il form per registrarti come Mentore o Mentee
            </p>
          </CardHeader>
          <CardContent>
            {step === 1 ? (
              /* Step 1 */
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      name="nome"
                      value={formData.nome}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <Label htmlFor="cognome">Cognome</Label>
                    <Input
                      id="cognome"
                      name="cognome"
                      value={formData.cognome}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="dataNascita">Data di Nascita</Label>
                  <Input
                    id="dataNascita"
                    name="dataNascita"
                    type="date"
                    value={formData.dataNascita}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label>Genere</Label>
                  <RadioGroup
                    name="genere"
                    value={formData.genere}
                    onValueChange={(value) =>
                      setFormData(prev => ({ ...prev, genere: value }))
                    }
                    className="flex flex-col space-y-1 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="uomo" id="uomo" />
                      <Label htmlFor="uomo">Uomo</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="donna" id="donna" />
                      <Label htmlFor="donna">Donna</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="altro" id="altro" />
                      <Label htmlFor="altro">Altro</Label>
                    </div>
                  </RadioGroup>
                </div>
                <Button
                  onClick={handleNext}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Avanti
                </Button>
              </div>
            ) : (
              /* Step 2 */
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button variant="outline" onClick={handleBack} className="flex-1">
                    Indietro
                  </Button>
                  <Button
                    type="submit"
                    onClick={handleRegister}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                  >
                    Registrati
                  </Button>
                </div>
              </div>
            )}
            {error && <p className="text-red-600">{error}</p>}
            {successMessage && <p className="text-green-600">{successMessage}</p>}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
