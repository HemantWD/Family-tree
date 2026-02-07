import { useState } from "react";
import {
  UserPlus,
  Users,
  Heart,
  X,
  User,
  Upload,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function FamilyTree() {
  const [familyData, setFamilyData] = useState({
    id: "1",
    name: "Great Grandfather",
    gender: "male",
    image: null,
    birthYear: "1920",
    spouse: null,
    children: [
      {
        id: "2",
        name: "Daughter",
        gender: "female",
        image: null,
        birthYear: "1945",
        spouse: null,
        children: [
          {
            id: "6",
            name: "Grandchild 1",
            gender: "male",
            image: null,
            birthYear: "1970",
            spouse: null,
            children: [],
          },
          {
            id: "7",
            name: "Grandchild 2",
            gender: "female",
            image: null,
            birthYear: "1972",
            spouse: null,
            children: [],
          },
        ],
      },
      {
        id: "3",
        name: "Eldest Son",
        gender: "male",
        image: null,
        birthYear: "1948",
        spouse: null,
        children: [
          {
            id: "8",
            name: "First Grandchild",
            gender: "male",
            image: null,
            birthYear: "1975",
            spouse: {
              id: "8s",
              name: "Wife of First Grandchild",
              gender: "female",
              image: null,
              birthYear: "1977",
            },
            children: [],
          },
          {
            id: "9",
            name: "Second Grandchild",
            gender: "female",
            image: null,
            birthYear: "1978",
            spouse: {
              id: "9s",
              name: "Husband of Second Grandchild",
              gender: "male",
              image: null,
              birthYear: "1976",
            },
            children: [],
          },
        ],
      },
      {
        id: "4",
        name: "Second Son",
        gender: "male",
        image: null,
        birthYear: "1950",
        spouse: null,
        children: [
          {
            id: "10",
            name: "Grandchild 3",
            gender: "male",
            image: null,
            birthYear: "1980",
            spouse: null,
            children: [],
          },
          {
            id: "11",
            name: "Grandchild 4",
            gender: "female",
            image: null,
            birthYear: "1982",
            spouse: null,
            children: [],
          },
        ],
      },
      {
        id: "5",
        name: "Third Son",
        gender: "male",
        image: null,
        birthYear: "1953",
        spouse: null,
        children: [
          {
            id: "12",
            name: "Grandchild 5",
            gender: "male",
            image: null,
            birthYear: "1985",
            spouse: null,
            children: [],
          },
          {
            id: "13",
            name: "Grandchild 6",
            gender: "female",
            image: null,
            birthYear: "1987",
            spouse: null,
            children: [],
          },
        ],
      },
    ],
  });

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    gender: "male",
    image: null,
    birthYear: "",
  });
  const [collapsedNodes, setCollapsedNodes] = useState(new Set());
  const [hoveredNode, setHoveredNode] = useState(null);

  const openModal = (node, type) => {
    setSelectedNode(node);
    setModalType(type);
    setShowModal(true);
    const currentYear = new Date().getFullYear();
    setFormData({
      name: "",
      gender:
        type === "spouse"
          ? node.gender === "male"
            ? "female"
            : "male"
          : "male",
      image: null,
      birthYear:
        type === "child" ? String(currentYear - 20) : String(currentYear - 25),
    });
  };

  const openEditModal = (node) => {
    setEditingNode(node);
    setShowModal(true);
    setModalType("edit");
    setFormData({
      name: node.name,
      gender: node.gender,
      image: node.image,
      birthYear: node.birthYear || "",
    });
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedNode(null);
    setEditingNode(null);
    setModalType(null);
    setFormData({ name: "", gender: "male", image: null, birthYear: "" });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5000000) {
        alert("Image size should be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const deleteMember = (nodeId) => {
    if (!confirm("Are you sure you want to delete this family member?")) {
      return;
    }

    const deleteNode = (node) => {
      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children
            .filter((child) => child.id !== nodeId)
            .map(deleteNode),
        };
      }
      return node;
    };

    setFamilyData(deleteNode(familyData));
  };

  const updateMember = () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    const updateNode = (node) => {
      if (node.id === editingNode.id) {
        return {
          ...node,
          name: formData.name.trim(),
          gender: formData.gender,
          image: formData.image,
          birthYear: formData.birthYear,
        };
      }

      if (node.spouse && node.spouse.id === editingNode.id) {
        return {
          ...node,
          spouse: {
            ...node.spouse,
            name: formData.name.trim(),
            gender: formData.gender,
            image: formData.image,
            birthYear: formData.birthYear,
          },
        };
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(updateNode),
        };
      }

      return node;
    };

    setFamilyData(updateNode(familyData));
    closeModal();
  };

  const addMember = () => {
    if (!formData.name.trim()) {
      alert("Please enter a name");
      return;
    }

    const updateTree = (node) => {
      if (node.id === selectedNode.id) {
        if (modalType === "spouse") {
          if (node.spouse) {
            alert("Spouse already exists");
            return node;
          }
          return {
            ...node,
            spouse: {
              id: Date.now().toString() + "s",
              name: formData.name.trim(),
              gender: formData.gender,
              image: formData.image,
              birthYear: formData.birthYear,
            },
          };
        } else if (modalType === "child") {
          const newChild = {
            id: Date.now().toString(),
            name: formData.name.trim(),
            gender: formData.gender,
            image: formData.image,
            birthYear: formData.birthYear,
            spouse: null,
            children: [],
          };
          return {
            ...node,
            children: [...(node.children || []), newChild],
          };
        }
      }

      if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: node.children.map(updateTree),
        };
      }

      return node;
    };

    setFamilyData(updateTree(familyData));
    closeModal();
  };

  const toggleCollapse = (nodeId) => {
    const newCollapsed = new Set(collapsedNodes);
    if (newCollapsed.has(nodeId)) {
      newCollapsed.delete(nodeId);
    } else {
      newCollapsed.add(nodeId);
    }
    setCollapsedNodes(newCollapsed);
  };

  const PersonCard = ({ person, nodeId }) => {
    const isHovered = hoveredNode === nodeId;
    const bgGradient =
      person.gender === "male"
        ? "from-blue-50 to-indigo-100 border-blue-400"
        : "from-rose-50 to-pink-100 border-rose-400";

    return (
      <div
        className={`relative bg-gradient-to-br ${bgGradient} border-2 rounded-2xl p-4 shadow-lg hover:shadow-2xl transition-all duration-300 min-w-[160px] max-w-[160px] transform hover:scale-105 hover:-translate-y-1`}
        onMouseEnter={() => setHoveredNode(nodeId)}
        onMouseLeave={() => setHoveredNode(null)}
        style={{
          animation: "fadeIn 0.5s ease-out",
        }}
      >
        {/* Edit/Delete buttons */}
        {isHovered && (
          <div className="absolute -top-2 -right-2 flex gap-1 z-10 opacity-0 animate-fadeIn">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(person);
              }}
              className="p-1.5 bg-white rounded-full shadow-md hover:bg-blue-50 transition-colors border border-gray-200"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            </button>
            {nodeId !== "1" && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteMember(nodeId);
                }}
                className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors border border-gray-200"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-600" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col items-center">
          {/* Image */}
          <div className="relative w-24 h-24 rounded-full bg-white overflow-hidden mb-3 border-4 border-white shadow-xl ring-2 ring-gray-100">
            {person.image ? (
              <img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${person.gender === "male" ? "from-blue-100 to-blue-200" : "from-pink-100 to-pink-200"}`}
              >
                <User
                  className={`w-12 h-12 ${person.gender === "male" ? "text-blue-500" : "text-pink-500"}`}
                />
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-base text-center text-gray-900 break-words w-full mb-1 leading-tight">
            {person.name}
          </h3>
          {person.birthYear && (
            <p className="text-xs text-gray-600 font-medium">
              Born {person.birthYear}
            </p>
          )}
          <span
            className={`text-xs font-semibold mt-1 px-2 py-0.5 rounded-full ${person.gender === "male" ? "bg-blue-200 text-blue-800" : "bg-pink-200 text-pink-800"}`}
          >
            {person.gender === "male" ? "♂" : "♀"} {person.gender}
          </span>
        </div>
      </div>
    );
  };

  const FamilyNode = ({ node }) => {
    const hasChildren = node.children && node.children.length > 0;
    const hasSpouse = node.spouse !== null;
    const isCollapsed = collapsedNodes.has(node.id);

    return (
      <div
        className="flex flex-col items-center"
        style={{ animation: "slideIn 0.6s ease-out" }}
      >
        {/* Person and Spouse */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-6 mb-3">
            <PersonCard person={node} nodeId={node.id} />

            {hasSpouse && (
              <>
                <div className="relative">
                  <Heart className="w-8 h-8 text-red-500 fill-red-500 drop-shadow-lg animate-pulse" />
                  <div className="absolute inset-0 w-8 h-8 bg-red-500 blur-xl opacity-30 animate-pulse"></div>
                </div>
                <PersonCard person={node.spouse} nodeId={node.spouse.id} />
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mb-6">
            {!hasSpouse && (
              <button
                onClick={() => openModal(node, "spouse")}
                className="group px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-sm font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105"
              >
                <Heart className="w-4 h-4 group-hover:scale-110 transition-transform" />
                Add Spouse
              </button>
            )}
            <button
              onClick={() => openModal(node, "child")}
              className="group px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-xl transform hover:scale-105"
            >
              <UserPlus className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Add Child
            </button>
            {hasChildren && (
              <button
                onClick={() => toggleCollapse(node.id)}
                className="px-3 py-2 bg-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:bg-gray-300 transition-colors shadow-md"
              >
                {isCollapsed ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronUp className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Vertical Line to Children */}
        {hasChildren && !isCollapsed && (
          <div className="w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full shadow-sm"></div>
        )}

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div className="flex flex-col items-center">
            {/* Horizontal Line */}
            {node.children.length > 1 && (
              <div
                className="relative h-1 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full shadow-sm"
                style={{ width: `${(node.children.length - 1) * 220 + 160}px` }}
              >
                {/* Vertical connectors to each child */}
                {node.children.map((_, index) => (
                  <div
                    key={index}
                    className="absolute w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full shadow-sm -bottom-12"
                    style={{ left: `${index * 220 + 80}px` }}
                  ></div>
                ))}
              </div>
            )}

            {/* Single child connector */}
            {node.children.length === 1 && (
              <div className="w-1 h-12 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full shadow-sm"></div>
            )}

            {/* Children Nodes */}
            <div className="flex gap-14 mt-12">
              {node.children.map((child) => (
                <FamilyNode key={child.id} node={child} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>

      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
                <Users className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                  Family Tree
                </h1>
                <p className="text-gray-600 mt-1 font-medium">
                  Interactive 4 Generation Lineage
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="px-4 py-2 bg-blue-100 rounded-full">
                <span className="font-semibold text-blue-800">♂ Male</span>
              </div>
              <div className="px-4 py-2 bg-pink-100 rounded-full">
                <span className="font-semibold text-pink-800">♀ Female</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tree Container */}
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-16 overflow-x-auto border border-white/20">
          <div className="inline-block min-w-full">
            <FamilyNode node={familyData} />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-gray-600 text-sm">
          <p>
            💡 Hover over cards to edit or delete • Click buttons to add family
            members
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 transform scale-100 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                {modalType === "spouse"
                  ? "💑 Add Spouse"
                  : modalType === "edit"
                    ? "✏️ Edit Member"
                    : "👶 Add Child"}
              </h2>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>

              {/* Birth Year */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Birth Year
                </label>
                <input
                  type="text"
                  value={formData.birthYear}
                  onChange={(e) =>
                    setFormData({ ...formData, birthYear: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g., 1990"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Gender *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: "male" })}
                    disabled={modalType === "spouse"}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      formData.gender === "male"
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${modalType === "spouse" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ♂ Male
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, gender: "female" })
                    }
                    disabled={modalType === "spouse"}
                    className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                      formData.gender === "female"
                        ? "bg-pink-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    } ${modalType === "spouse" ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    ♀ Female
                  </button>
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Profile Photo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
                  >
                    <Upload className="w-5 h-5 text-gray-500 mr-2" />
                    <span className="text-gray-600 font-medium">
                      Choose Photo
                    </span>
                  </label>
                </div>
                {formData.image && (
                  <div className="mt-4 flex justify-center">
                    <div className="relative">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl ring-2 ring-gray-200"
                      />
                      <button
                        onClick={() =>
                          setFormData({ ...formData, image: null })
                        }
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={modalType === "edit" ? updateMember : addMember}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  {modalType === "edit" ? "Update" : "Add"}{" "}
                  {modalType === "spouse"
                    ? "Spouse"
                    : modalType === "edit"
                      ? "Member"
                      : "Child"}
                </button>
                <button
                  onClick={closeModal}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-bold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
