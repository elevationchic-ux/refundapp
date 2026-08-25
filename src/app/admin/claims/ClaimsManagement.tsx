'use client';

import { useState } from 'react';
import { FileText, Edit, Trash2, UserCheck, Clock, CheckCircle, XCircle, Search } from 'lucide-react';

interface Claim {
  id: string;
  reference: string | null;
  status: string;
  description: string;
  amount: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  } | null;
  agent: {
    id: string;
    name: string | null;
  } | null;
}

interface Agent {
  id: string;
  name: string | null;
  email: string;
}

interface ClaimsManagementProps {
  claims: Claim[];
  agents: Agent[];
}

export function ClaimsManagement({ claims: initialClaims, agents }: ClaimsManagementProps) {
  const [claims, setClaims] = useState(initialClaims);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ status: '', agentId: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEdit = (claim: Claim) => {
    setEditingId(claim.id);
    setEditForm({ 
      status: claim.status, 
      agentId: claim.agent?.id || '' 
    });
  };

  const handleSaveEdit = async (claimId: string) => {
    try {
      const res = await fetch(`/api/admin/claims/${claimId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setClaims(claims.map(c => 
          c.id === claimId 
            ? { ...c, status: updated.status, agent: updated.agent }
            : c
        ));
      }
    } catch (error) {
      console.error('Failed to update claim:', error);
    } finally {
      setEditingId(null);
    }
  };

  const handleDelete = async (claimId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce dossier ?')) return;
    
    setIsDeleting(claimId);
    try {
      const res = await fetch(`/api/admin/claims/${claimId}`, {
        method: 'DELETE',
      });
      
      if (res.ok) {
        setClaims(claims.filter(c => c.id !== claimId));
      }
    } catch (error) {
      console.error('Failed to delete claim:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const config = {
      PENDING: { color: 'bg-yellow-100 text-yellow-700', icon: Clock },
      INVESTIGATING: { color: 'bg-blue-100 text-blue-700', icon: Search },
      RESOLVED: { color: 'bg-green-100 text-green-700', icon: CheckCircle },
      REJECTED: { color: 'bg-red-100 text-red-700', icon: XCircle },
    };
    return config[status as keyof typeof config] || config.PENDING;
  };

  const filteredClaims = claims.filter(claim => {
    const matchesSearch = 
      claim.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      claim.user?.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || claim.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency || 'EUR',
    }).format(amount);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher par référence, description ou email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="all">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="INVESTIGATING">En cours</option>
          <option value="RESOLVED">Résolu</option>
          <option value="REJECTED">Rejeté</option>
        </select>
      </div>

      {/* Claims table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dossier
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Montant
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredClaims.map((claim) => {
                const statusConfig = getStatusBadge(claim.status);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={claim.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {claim.reference || 'Sans référence'}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {claim.description.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="font-medium text-gray-900">{claim.user?.name || 'N/A'}</p>
                        <p className="text-gray-500 text-xs">{claim.user?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatAmount(Number(claim.amount), claim.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === claim.id ? (
                        <select
                          value={editForm.status}
                          onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="PENDING">En attente</option>
                          <option value="INVESTIGATING">En cours</option>
                          <option value="RESOLVED">Résolu</option>
                          <option value="REJECTED">Rejeté</option>
                        </select>
                      ) : (
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.color}`}>
                          <StatusIcon className="h-3.5 w-3.5" />
                          {claim.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === claim.id ? (
                        <select
                          value={editForm.agentId}
                          onChange={(e) => setEditForm({ ...editForm, agentId: e.target.value })}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value="">Non assigné</option>
                          {agents.map(agent => (
                            <option key={agent.id} value={agent.id}>
                              {agent.name || agent.email}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center gap-2">
                          {claim.agent ? (
                            <>
                              <UserCheck className="h-4 w-4 text-green-600" />
                              <span className="text-sm text-gray-900">{claim.agent.name}</span>
                            </>
                          ) : (
                            <span className="text-sm text-gray-400">Non assigné</span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(claim.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === claim.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleSaveEdit(claim.id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                          >
                            Sauvegarder
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm transition-colors"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(claim)}
                            className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(claim.id)}
                            disabled={isDeleting === claim.id}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        
        {filteredClaims.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            Aucun dossier trouvé
          </div>
        )}
      </div>
    </div>
  );
}
