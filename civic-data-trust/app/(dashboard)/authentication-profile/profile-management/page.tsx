"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, MapPin, Calendar, User, Plus, MoreHorizontal, Sun, Edit, Save } from "lucide-react"

interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  occupation: string
  phone: string
  email: string
  address: string
  scheduledAppt: string
  specialNotes: string
  referringDoctor: string
  assignedDoctor: string
  familyDoctor: string
  affiliation: string
  avatar: string
}

interface VitalSign {
  label: string
  value: string
  unit: string
  trend: number[]
  color: string
}

const mockPatient: PatientData = {
  id: "1",
  name: "Jessica Alexander",
  age: 29,
  gender: "Female",
  occupation: "Engineer",
  phone: "STES 3453 6605",
  email: "j.alexander@email.com",
  address: "795 Ave Rockland,Outremont, Montreal, Canada",
  scheduledAppt: "14 Mar 2021",
  specialNotes: "Patient is Deaf. Talk to his wife.",
  referringDoctor: "Dre Chantal Godin",
  assignedDoctor: "Audrey Smith",
  familyDoctor: "Dre Chantal Godin",
  affiliation: "Brunet Affiliated",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
}


const vitalSigns: VitalSign[] = [
  {
    label: "Blood Pressure",
    value: "120",
    unit: "mmHg",
    trend: [118, 120, 119, 121, 120, 118, 122],
    color: "blue",
  },
  {
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    trend: [70, 72, 74, 71, 72, 73, 72],
    color: "purple",
  },
  {
    label: "Temperature",
    value: "98.6",
    unit: "°F",
    trend: [98.4, 98.6, 98.5, 98.7, 98.6, 98.5, 98.6],
    color: "orange",
  },
  {
    label: "Oxygen Saturation",
    value: "98",
    unit: "%",
    trend: [97, 98, 98, 97, 98, 99, 98],
    color: "green",
  },
]

const physicalExamData = [
  { category: "General", finding: "Blockage in left artery", value: "120 mmHg" },
  { category: "Cardiac", finding: "Congestion in left side of chest", value: "72 / min" },
  { category: "Abdomen", finding: "Mass on right side", value: "76 Kg" },
  { category: "Volume status", finding: "S/P", value: "80 cm" },
  { category: "Edema", finding: "Oedema in the left side", value: "80" },
]

const ProfileManagement = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [patient, setPatient] = useState<PatientData>(mockPatient)
  const [consultationNotes, setConsultationNotes] = useState("Type")

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to an API
  }

  const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    return (
      <div className="flex items-end h-8 gap-0.5">
        {data.map((value, index) => {
          const height = ((value - min) / range) * 100
          return (
            <div
              key={index}
              className={`w-1 bg-${color}-500 rounded-sm`}
              style={{ height: `${Math.max(height, 10)}%` }}
            />
          )
        })}
      </div>
    )
  }

  return (
<div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm  dark:text-gray-400">
          <span>AUthentication & Profile</span>
          <span>/</span>
          <span className="font-medium  dark:text-white">Patient Management</span>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
          {isEditing ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Patient Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Basic Info */}
          <div className=" dark:bg-[#1F1F23] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-start gap-4">
              <div className="relative">
                <Image
                  src={patient.avatar || "/placeholder.svg"}
                  alt={patient.name}
                  width={80}
                  height={80}
                  className="rounded-lg object-cover"
                />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-xl font-bold  dark:text-white">{patient.name}</h1>
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Age, Gender</span>
                    <p className="font-medium  dark:text-white">
                      {patient.age} Yrs, {patient.gender}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Occupation</span>
                    <p className="font-medium  dark:text-white">{patient.occupation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Scheduled Appt</span>
                    <p className="font-medium  dark:text-white">{patient.scheduledAppt}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 dark:text-gray-400">Special Notes</span>
                    <p className="font-medium text-red-600 dark:text-red-400">{patient.specialNotes}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Phone</span>
                    <span className="font-medium  dark:text-white">{patient.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Email</span>
                    <span className="font-medium  dark:text-white">{patient.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500 dark:text-gray-400 block">Address</span>
                    <span className="font-medium  dark:text-white">{patient.address}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Medical Team */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Referring Doctor</span>
                  <span className="font-medium  dark:text-white">{patient.referringDoctor}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Assigned Doctor</span>
                  <span className="font-medium  dark:text-white">{patient.assignedDoctor}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Family Doctor</span>
                  <span className="font-medium  dark:text-white">{patient.familyDoctor}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400 block">Pharmacy</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium  dark:text-white">{patient.affiliation}</span>
                    <Phone className="h-3 w-3 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Factors */}
          <div className="dark:bg-[#1F1F23] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold  dark:text-white">Risk Factor</h2>
              <MoreHorizontal className="h-5 w-5 " />
            </div>

            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 opacity-50">
                  <svg viewBox="0 0 200 200" className="w-full h-full dark:text-gray-400">
                    <path
                      d="M50 150 Q100 50 150 150"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className=""
                    />
                    <circle
                      cx="100"
                      cy="100"
                      r="30"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className=""
                    />
                    <path
                      d="M85 100 L95 110 L115 90"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                      className=""
                    />
                  </svg>
                </div>
                <p className=" dark:text-gray-400 mb-4">No risk factor added.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600  rounded-lg hover:bg-blue-700 transition-colors mx-auto">
                  <Plus className="h-4 w-4" />
                  Add risk factor
                </button>
              </div>
            </div>
          </div>

          {/* Physical Exam */}
          <div className=" dark:bg-[#1F1F23] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold  dark:text-white">Physical Exam</h2>
              <MoreHorizontal className="h-5 w-5 " />
            </div>

            <div className="space-y-4">
              {physicalExamData.map((exam, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b  dark:border-gray-700 last:border-b-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium  dark:text-white">{exam.category}</p>
                    <p className="text-xs  dark:text-gray-400">{exam.finding}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium  dark:text-white">{exam.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Vital Signs Chart */}
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {vitalSigns.map((vital, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs  dark:text-gray-400">{vital.label}</span>
                      <span className="text-sm font-medium  dark:text-white">
                        {vital.value} {vital.unit}
                      </span>
                    </div>
                    <MiniChart data={vital.trend} color={vital.color} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Weather & Notes */}
        <div className="space-y-6">
          {/* Weather Widget */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                <span className="text-sm opacity-90">24° C</span>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">☀</span>
                </button>
                <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <span className="text-sm">🌙</span>
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm opacity-90">Good Morning</p>
              <h3 className="text-lg font-semibold">Dr. Audrey Graham</h3>
            </div>

            <div className="space-y-3">
              <p className="text-sm opacity-90">Consultation notes:</p>
              <div className="bg-white/10 rounded-lg p-3">
                <input
                  type="text"
                  value={consultationNotes}
                  onChange={(e) => setConsultationNotes(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-white placeholder-white/70"
                  placeholder="Type your notes here..."
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Schedule Follow-up</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add Family Member</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-gray-900 dark:text-white">Add Prescription</span>
              </button>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white dark:bg-[#1F1F23] rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Updates</h3>
            <div className="space-y-3">
              <div className="text-xs text-gray-500 dark:text-gray-400">Last updated on 26 Jul 2020, 11:30 AM</div>
              <div className="space-y-2">
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
                  <span className="font-medium">Blood pressure</span> updated by Dr. Smith
                </div>
                <div className="p-2 bg-gray-50 dark:bg-gray-800/50 rounded text-xs">
                  <span className="font-medium">Medication</span> prescribed by Dr. Graham
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileManagement