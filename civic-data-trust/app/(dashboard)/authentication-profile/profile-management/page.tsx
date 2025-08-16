"use client"

import { useState } from "react"
import Image from "next/image"
import { Phone, Mail, MapPin, Calendar, User, Plus, Edit, Save } from "lucide-react"

interface PatientData {
  id: string
  name: string
  age: number
  gender: string
  occupation: string
  phone: string
  email: string
  address: string
  joiningDate: string
  followers: number
  referringDoctor: string
  assignedDoctor: string
  familyDoctor: string
  affiliation: string
  avatar: string
}

// interface VitalSign {
//   label: string
//   value: string
//   unit: string
//   trend: number[]
//   color: string
// }

const mockPatient: PatientData = {
  id: "1",
  name: "Jessica Alexander",
  age: 29,
  gender: "Female",
  occupation: "Engineer",
  phone: "STES 3453 6605",
  email: "j.alexander@email.com",
  address: "795 Ave Rockland,Outremont, Montreal, Canada",
  joiningDate: "14 Mar 2021",
  followers: 50,
  referringDoctor: "Dre Chantal Godin",
  assignedDoctor: "Audrey Smith",
  familyDoctor: "Dre Chantal Godin",
  affiliation: "Brunet Affiliated",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
}



const ProfileManagement = () => {
  const [isEditing, setIsEditing] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [patient, setPatient] = useState<PatientData>(mockPatient)

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm  ">
          <span>Authentication & Profile</span>
          <span>/</span>
          <span className="font-medium ">Profile Management</span>
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
          {/* Basic Info */}
          <div className="  rounded-xl p-6 border border-primary">
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
                  <h1 className="text-xl font-bold  ">{patient.name}</h1>
                  <span className="px-2 py-1 bg-blue-100  text-blue-700 text-xs rounded-full">
                    Online
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500 ">Age, Gender</span>
                    <p className="font-medium  ">
                      {patient.age} Yrs, {patient.gender}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500 ">Occupation</span>
                    <p className="font-medium  ">{patient.occupation}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 ">Joining Date</span>
                    <p className="font-medium  ">{patient.joiningDate}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 ">Follower</span>
                    <p className="font-medium text-green-600 dark:text-red-400">{patient.followers}</p>
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
                    <span className="text-gray-500  block">Phone</span>
                    <span className="font-medium  ">{patient.phone}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500  block">Email</span>
                    <span className="font-medium  ">{patient.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <div>
                    <span className="text-gray-500  block">Address</span>
                    <span className="font-medium  ">{patient.address}</span>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Create channel */}
          <div className="rounded-xl p-6 border border-primary">
            <div className="flex items-center justify-between mb-4">
              {/* <h2 className="text-lg font-semibold  ">Create Channel</h2> */}
              {/* <MoreHorizontal className="h-5 w-5 " /> */}
            </div>

            <div className="flex  items-center justify-center ">
              <div className=" text-center">
                <div className="w-20 h-20 mx-auto mb-4 opacity-50">
                  <svg viewBox="0 0 200 200" className="w-full h-full ">
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
                <p className="  mb-4">Create your channel.</p>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600  rounded-lg hover:bg-blue-700 transition-colors mx-auto">
                  <Plus className="h-4 w-4" />
                  Create
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Available Channel */}
          <div className=" rounded-xl p-6 border border-primary ">
            <h3 className="text-lg font-semibold   mb-4">Your Available Channel</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium  ">Channel 1</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <User className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium  ">Channel 2</span>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg transition-colors">
                <Plus className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium  ">Channel 3</span>
              </button>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="  rounded-xl p-6 border border-primary ">
            <h3 className="text-lg font-semibold  mb-4">Recent Uploaded Data</h3>
            <div className="space-y-3">
              <div className="text-xs text-gray-500 ">Last updated on 26 Jul 2020, 11:30 AM</div>
              <div className="space-y-2">
                <div className="p-2   rounded text-xs">
                  <span className="font-medium">In channel 1 </span>a jpg file uploaded by you
                </div>
                <div className="p-2  rounded text-xs">
                  <span className="font-medium">In Channel 2</span> a mp3 file uploaded
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     </div> )
}

      export default ProfileManagement