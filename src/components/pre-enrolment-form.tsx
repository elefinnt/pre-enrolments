"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Plus, Trash2, Copy } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Parent {
  name: string;
  phone: string;
  email: string;
  relationship: string;
}

interface FormData {
  childName: string;
  gender: string;
  dateOfBirth: Date | undefined;
  parents: Parent[];
  address: string;
}

const TERM_DATES_2025 = [
  { term: 1, start: new Date(2025, 1, 4), end: new Date(2025, 3, 11) }, // Feb 4 - Apr 11
  { term: 2, start: new Date(2025, 3, 28), end: new Date(2025, 5, 27) }, // Apr 28 - Jun 27
  { term: 3, start: new Date(2025, 6, 14), end: new Date(2025, 8, 19) }, // Jul 14 - Sep 19
  { term: 4, start: new Date(2025, 9, 6), end: new Date(2025, 11, 18) }, // Oct 6 - Dec 18
];

function calculateEnrollmentDetails(dateOfBirth: Date) {
  const today = new Date();
  const age = calculateAge(dateOfBirth);

  // If child is currently under 5 years old, they go to Year 0
  // If child is 5 or older, they go to Year 1
  const classification = age.years < 5 ? "Year 0" : "Year 1";

  // Enrollment year is still calculated as birth year + 5
  const enrollmentYear = dateOfBirth.getFullYear() + 5;

  return { enrollmentYear, classification };
}

function getNextIntakeDates(enrollmentYear: number) {
  // For simplicity, using 2025 term structure
  // In a real app, you'd calculate this dynamically for the enrollment year
  const intakeDates: Date[] = [];

  TERM_DATES_2025.forEach((term) => {
    // Find 1st and 6th Monday of each term
    const termStart = new Date(term.start);
    const firstMonday = getFirstMondayOfTerm(termStart);
    const sixthMonday = new Date(firstMonday);
    sixthMonday.setDate(firstMonday.getDate() + 5 * 7); // Add 5 weeks

    if (sixthMonday <= term.end) {
      intakeDates.push(firstMonday, sixthMonday);
    } else {
      intakeDates.push(firstMonday);
    }
  });

  return intakeDates.filter((date) => date >= new Date());
}

function getFirstMondayOfTerm(termStart: Date): Date {
  const date = new Date(termStart);
  const dayOfWeek = date.getDay();
  const daysUntilMonday = dayOfWeek === 0 ? 1 : (8 - dayOfWeek) % 7;
  date.setDate(date.getDate() + daysUntilMonday);
  return date;
}

function calculateAge(dateOfBirth: Date): { years: number; months: number } {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  // If the current month/day is before the birth month/day, subtract a year and adjust months
  if (months < 0 || (months === 0 && today.getDate() < birthDate.getDate())) {
    years--;
    months += 12;
  }

  // Adjust for day of month
  if (today.getDate() < birthDate.getDate()) {
    months--;
    if (months < 0) {
      months = 11;
      years--;
    }
  }

  return { years, months };
}

export default function PreEnrollmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    childName: "",
    gender: "",
    dateOfBirth: undefined,
    parents: [{ name: "", phone: "", email: "", relationship: "Mother" }],
    address: "",
  });

  const addParent = () => {
    setFormData((prev) => ({
      ...prev,
      parents: [
        ...prev.parents,
        { name: "", phone: "", email: "", relationship: "Father" },
      ],
    }));
  };

  const removeParent = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      parents: prev.parents.filter((_, i) => i !== index),
    }));
  };

  const updateParent = (index: number, field: keyof Parent, value: string) => {
    setFormData((prev) => ({
      ...prev,
      parents: prev.parents.map((parent, i) =>
        i === index ? { ...parent, [field]: value } : parent,
      ),
    }));
  };

  const resetForm = () => {
    setFormData({
      childName: "",
      gender: "",
      dateOfBirth: undefined,
      parents: [{ name: "", phone: "", email: "", relationship: "Mother" }],
      address: "",
    });
    setCurrentStep(1);
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.childName && formData.gender && formData.dateOfBirth;
      case 2:
        return formData.parents.every(
          (parent) => parent.name && parent.phone && parent.email,
        );
      case 3:
        return formData.address.trim().length > 0;
      default:
        return true;
    }
  };

  const enrollmentDetails = formData.dateOfBirth
    ? calculateEnrollmentDetails(formData.dateOfBirth)
    : null;
  const nextIntakes = enrollmentDetails
    ? getNextIntakeDates(enrollmentDetails.enrollmentYear)
    : [];

  const copyToClipboard = () => {
    const summary = `
Child Details:
Name: ${formData.childName}
Gender: ${formData.gender}
Date of Birth: ${formData.dateOfBirth ? format(formData.dateOfBirth, "PPP") : ""}
${
  formData.dateOfBirth
    ? `Current Age: ${(() => {
        const age = calculateAge(formData.dateOfBirth);
        return `${age.years} years and ${age.months} months`;
      })()}`
    : ""
}

${
  enrollmentDetails
    ? `Enrollment Details:
Enrollment Year: ${enrollmentDetails.enrollmentYear}
Classification: ${enrollmentDetails.classification}`
    : ""
}

${
  nextIntakes.length > 0
    ? `Next Available Intake Dates:
${nextIntakes
  .slice(0, 4)
  .map((date) => format(date, "EEEE, MMMM do, yyyy"))
  .join("\n")}`
    : ""
}

Parent/Guardian Details:
${formData.parents
  .map(
    (parent) => `
${parent.relationship}:
Name: ${parent.name}
Phone: ${parent.phone}
Email: ${parent.email}`,
  )
  .join("\n")}

Address:
${formData.address}
    `.trim();

    void navigator.clipboard.writeText(summary);
    toast.success("Enrolment details copied to clipboard!");
  };

  return (
    <div className="mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Pre-Enrollment Application</CardTitle>
          <CardDescription>
            Step {currentStep} of 4 - Please provide the required information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Progress indicator */}
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={cn(
                  "h-2 flex-1 rounded-full",
                  step <= currentStep ? "bg-primary" : "bg-muted",
                )}
              />
            ))}
          </div>

          {/* Step 1: Child Information */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Child Information</h3>

              <div className="space-y-2">
                <Label htmlFor="childName">Child&apos;s Full Name</Label>
                <Input
                  type="text"
                  id="childName"
                  value={formData.childName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      childName: e.target.value,
                    }))
                  }
                  placeholder="Enter child's full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.dateOfBirth && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.dateOfBirth
                        ? format(formData.dateOfBirth, "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.dateOfBirth}
                      onSelect={(date) =>
                        setFormData((prev) => ({ ...prev, dateOfBirth: date }))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              {formData.dateOfBirth && (
                <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                  <div className="text-sm">
                    <p className="font-medium text-blue-800">
                      Enrollment Information:
                    </p>
                    {(() => {
                      const age = calculateAge(formData.dateOfBirth);
                      const details = calculateEnrollmentDetails(
                        formData.dateOfBirth,
                      );
                      return (
                        <div className="mt-1 space-y-1 text-blue-700">
                          <p>
                            Current Age: {age.years} years and {age.months}{" "}
                            months
                          </p>
                          <p>Year Level: {details.classification}</p>
                          <p>Enrollment Year: {details.enrollmentYear}</p>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Parent Information */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Parent/Guardian Information
                </h3>
                <Button onClick={addParent} variant="outline" size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Parent
                </Button>
              </div>

              {formData.parents.map((parent, index) => (
                <Card key={index} className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Parent/Guardian {index + 1}</h4>
                    {formData.parents.length > 1 && (
                      <Button
                        onClick={() => removeParent(index)}
                        variant="outline"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Relationship</Label>
                      <Select
                        value={parent.relationship}
                        onValueChange={(value) =>
                          updateParent(index, "relationship", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mother">Mother</SelectItem>
                          <SelectItem value="Father">Father</SelectItem>
                          <SelectItem value="Step-Mother">
                            Step-Mother
                          </SelectItem>
                          <SelectItem value="Step-Father">
                            Step-Father
                          </SelectItem>
                          <SelectItem value="Guardian">Guardian</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input
                        value={parent.name}
                        type="text"
                        onChange={(e) =>
                          updateParent(index, "name", e.target.value)
                        }
                        placeholder="Enter full name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        type="number"
                        value={parent.phone}
                        onChange={(e) =>
                          updateParent(index, "phone", e.target.value)
                        }
                        placeholder="Enter phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Email Address</Label>
                      <Input
                        type="email"
                        value={parent.email}
                        onChange={(e) =>
                          updateParent(index, "email", e.target.value)
                        }
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Step 3: Address */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Address Information</h3>

              <div className="space-y-2">
                <Label htmlFor="address">Home Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  placeholder="Enter complete home address including street, suburb, city, and postal code"
                  rows={4}
                />
              </div>
            </div>
          )}

          {/* Step 4: Summary */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Enrollment Summary</h3>
                <Button onClick={copyToClipboard} variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </div>

              <div className="grid gap-4">
                <Card className="p-4">
                  <h4 className="mb-2 font-medium">Child Details</h4>
                  <div className="space-y-1 text-sm">
                    <p>
                      <strong>Name:</strong> {formData.childName}
                    </p>
                    <p>
                      <strong>Gender:</strong> {formData.gender}
                    </p>
                    <p>
                      <strong>Date of Birth:</strong>{" "}
                      {formData.dateOfBirth
                        ? format(formData.dateOfBirth, "PPP")
                        : ""}
                    </p>
                    {formData.dateOfBirth && (
                      <p>
                        <strong>Current Age:</strong>{" "}
                        {(() => {
                          const age = calculateAge(formData.dateOfBirth);
                          return `${age.years} years and ${age.months} months`;
                        })()}
                      </p>
                    )}
                  </div>
                </Card>

                {enrollmentDetails && (
                  <Card className="p-4">
                    <h4 className="mb-2 font-medium">Enrollment Details</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <strong>Enrollment Year:</strong>{" "}
                        {enrollmentDetails.enrollmentYear}
                      </p>
                      <p>
                        <strong>Classification:</strong>{" "}
                        {enrollmentDetails.classification}
                      </p>
                    </div>
                  </Card>
                )}

                {nextIntakes.length > 0 && (
                  <Card className="p-4">
                    <h4 className="mb-2 font-medium">
                      Next Available Intake Dates
                    </h4>
                    <div className="space-y-1 text-sm">
                      {nextIntakes.slice(0, 4).map((date, index) => (
                        <p key={index}>{format(date, "EEEE, MMMM do, yyyy")}</p>
                      ))}
                    </div>
                  </Card>
                )}

                <Card className="p-4">
                  <h4 className="mb-2 font-medium">Parent/Guardian Details</h4>
                  {formData.parents.map((parent, index) => (
                    <div key={index} className="mb-3 last:mb-0">
                      <div className="space-y-1 text-sm">
                        <p>
                          <strong>{parent.relationship}:</strong> {parent.name}
                        </p>
                        <p>
                          <strong>Phone:</strong> {parent.phone}
                        </p>
                        <p>
                          <strong>Email:</strong> {parent.email}
                        </p>
                      </div>
                      {index < formData.parents.length - 1 && (
                        <hr className="my-2" />
                      )}
                    </div>
                  ))}
                </Card>

                <Card className="p-4">
                  <h4 className="mb-2 font-medium">Address</h4>
                  <p className="text-sm whitespace-pre-line">
                    {formData.address}
                  </p>
                </Card>
              </div>

              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="font-medium text-green-800">
                  Application Complete!
                </p>
                <p className="mt-1 text-sm text-green-700">
                  Thank you for submitting your pre-enrollment application.
                  Please feel free to copy the details to your clipboard to make
                  it easier to fill out the enrolment details - or click back to
                  the start to begin again.
                </p>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-6">
            <Button
              onClick={prevStep}
              variant="outline"
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            {currentStep < 4 ? (
              <Button onClick={nextStep} disabled={!isStepValid()}>
                Next
              </Button>
            ) : (
              <Button onClick={resetForm}>Back to the start</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
