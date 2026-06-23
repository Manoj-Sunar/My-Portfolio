import React, { useState, useMemo, useCallback } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ImageUpload from '../../components/common/ImageUpload';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  ExternalLink,
  Hash,
  Mail
} from 'lucide-react';
import { Card, Input, Button, Heading, Paragraph, Span, Label } from '../../components/common/UI';
import toast from 'react-hot-toast';
import { CertificateType } from '../../types';

const CertificatesPage: React.FC = () => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate, isLoading } = usePortfolio();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingCert, setEditingCert] = useState<CertificateType | null>(null);

  // Core Form states
  const [title, setTitle] = useState<string>('');
  const [issuer, setIssuer] = useState<string>('');
  const [issueDate, setIssueDate] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [credentialId, setCredentialId] = useState<string>('');
  const [credentialUrl, setCredentialUrl] = useState<string>('');
  const [image, setImage] = useState<{ url: string; publicId: string } | null>(null);

  const resetForm = useCallback(() => {
    setTitle('');
    setIssuer('');
    setIssueDate('');
    setExpiryDate('');
    setCredentialId('');
    setCredentialUrl('');
    setImage(null);
    setEditingCert(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((item: CertificateType) => {
    setEditingCert(item);
    setTitle(item.title);
    setIssuer(item.issuer);
    setIssueDate(item.issueDate || '');
    setExpiryDate(item.expiryDate || '');
    setCredentialId(item.credentialId || '');
    setCredentialUrl(item.credentialUrl || '');
    setImage(item.image?.url ? item.image : null);
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !issuer || !issueDate) {
      toast.error('Certificate title, issuer name and issue date are required.');
      return;
    }

    const payload = {
      title,
      issuer,
      issueDate,
      expiryDate,
      credentialId,
      credentialUrl,
      image: image || { url: '', publicId: '' },
    };

    let success = false;
    if (editingCert) {
      success = await updateCertificate(editingCert.id, payload);
    } else {
      success = await addCertificate(payload);
    }

    if (success) {
      setModalOpen(false);
      resetForm();
    }
  }, [editingCert, title, issuer, issueDate, expiryDate, credentialId, credentialUrl, image, updateCertificate, addCertificate, resetForm]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Are you absolutely sure you want to permanently delete the professional certificate for "${name}"? This is irreversible.`)) {
      await deleteCertificate(id);
    }
  }, [deleteCertificate]);

  const formatDate = useCallback((dateStr: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      const date = new Date(Number(parts[0]), Number(parts[1]) - 1, 15);
      return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    } catch {
      return dateStr;
    }
  }, []);

  const sortedCertificates = useMemo(() => {
    return [...certificates].sort((a, b) => a.order - b.order);
  }, [certificates]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-1">
          <Heading level={1} className="text-slate-900 dark:text-white leading-tight flex items-center gap-2">
            <Award className="text-blue-600" size={26} />
            <Span className="text-slate-900 dark:text-white font-extrabold text-2xl">Manage Certificates</Span>
          </Heading>
          <Paragraph className="text-xs text-slate-505 font-semibold uppercase tracking-widest text-blue-600 leading-relaxed bg-transparent">
            Publish verified micro-credentials, licenses, and graduation scroll documents
          </Paragraph>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="hover:-translate-y-0.5"
        >
          <Plus size={15} className="mr-1.5" />
          <Span className="text-white font-bold text-xs">Add Certificate</Span>
        </Button>
      </div>

      {/* 2. Grid items display */}
      {sortedCertificates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedCertificates.map((cert) => {
            const hasImage = cert.image?.url;
            return (
              <Card
                key={cert.id}
                className="overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between p-0"
              >
                <div>
                  {/* Thumbnail Banner */}
                  <div className="aspect-video bg-slate-50 dark:bg-slate-950 relative border-b border-slate-100 dark:border-slate-800 overflow-hidden flex items-center justify-center">
                    {hasImage ? (
                      <img
                        src={cert.image.url}
                        alt={cert.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="text-slate-400 text-xs flex flex-col items-center gap-1">
                        <Award size={28} />
                        <Span className="font-semibold text-[10px] text-slate-400">No preview document uploaded</Span>
                      </div>
                    )}
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="space-y-1">
                      <Span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900 text-[10px] font-bold text-blue-600 dark:text-blue-400 rounded">
                        {cert.issuer}
                      </Span>
                      <Heading level={4} className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{cert.title}</Heading>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 font-semibold">
                      <div className="flex items-center space-x-1.5">
                        <Calendar size={13} className="text-slate-400" />
                        <Span className="text-slate-500 dark:text-slate-400 text-xs font-normal">
                          Issued: {formatDate(cert.issueDate)} {cert.expiryDate ? `• Expires: ${formatDate(cert.expiryDate)}` : ''}
                        </Span>
                      </div>

                      {cert.credentialId && (
                        <div className="flex items-center space-x-1.5 font-mono">
                          <Hash size={13} className="text-slate-400" />
                          <Span className="truncate text-xs text-slate-500 dark:text-slate-400 font-mono font-normal">ID: {cert.credentialId}</Span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Operations */}
                <div className="px-6 py-4.5 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div>
                    {cert.credentialUrl ? (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1.5 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
                      >
                        <Span className="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline pointer-events-none">Verify Link</Span>
                        <ExternalLink size={11} className="text-blue-600 dark:text-blue-450" />
                      </a>
                    ) : (
                      <Span className="text-[10px] text-slate-450 dark:text-slate-500 uppercase font-bold tracking-wide">No Verification Link</Span>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleOpenEdit(cert)}
                      className="px-3 py-1.5 h-auto text-xs font-bold inline-flex items-center space-x-1"
                    >
                      <Edit2 size={12} />
                      <Span className="text-xs font-bold">Edit</Span>
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(cert.id, cert.title)}
                      className="px-3 py-1.5 h-auto text-xs font-bold inline-flex items-center space-x-1 text-slate-650 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-200 dark:hover:border-red-900 border border-slate-200 dark:border-slate-800"
                    >
                      <Trash2 size={12} />
                      <Span className="text-xs font-bold">Delete</Span>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-16 border-dashed border-slate-200 dark:border-slate-800">
          <Paragraph className="text-slate-500 font-medium bg-transparent">No professional credentials listed yet.</Paragraph>
          <Button variant="ghost" onClick={handleOpenCreate} className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Publish your first certificate
          </Button>
        </Card>
      )}

      {/* ======================================= */}
      {/* DIALOG FORM MODAL                       */}
      {/* ======================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-xl p-0 overflow-hidden flex flex-col max-h-[95vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <Heading level={5} className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                {editingCert ? 'Edit Certificate Entry' : 'Upload New Certificate Details'}
              </Heading>
              <button onClick={() => setModalOpen(false)} className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200 rounded-lg transition cursor-pointer">
                <X size={18} />
              </button>
            </div>

            {/* Scrollable forms */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-5 text-xs text-left">
              
              {/* Document Image Uploader */}
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label>Certificate Document Image File</Label>
                  <ImageUpload
                    value={image || undefined}
                    onChange={(val) => setImage(val)}
                    folder="certificates"
                  />
                  <Paragraph className="text-[10px] text-slate-400 dark:text-slate-500 bg-transparent leading-normal mt-1 font-normal">
                    Upload a crisp, readable snapshot/PDF image of your certificate or license document.
                  </Paragraph>
                </div>

                <div className="space-y-1 w-full text-left">
                  <Input
                    id="cert-image-url"
                    type="url"
                    label="Or Paste Certificate Image URL"
                    placeholder="https://example.com/certificate-image.png"
                    value={image?.url || ''}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (val) {
                        setImage({ url: val, publicId: image?.publicId || 'external' });
                      } else {
                        setImage(null);
                      }
                    }}
                  />
                  <Paragraph className="text-[10px] text-slate-400 dark:text-slate-500 bg-transparent leading-normal mt-1 font-normal">
                    Or directly paste a web link / CDN link of the certificate image to store in the database.
                  </Paragraph>
                </div>
              </div>

              {/* Title & Issuer fields */}
              <Input
                id="cert-title"
                type="text"
                required
                label="Certificate Title"
                placeholder="e.g. AWS Certified Solutions Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <Input
                id="cert-issuer"
                type="text"
                required
                label="Issuing Academy / Organization"
                placeholder="e.g. Amazon Web Services, Udemy, Coursera"
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
              />

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="cert-issued"
                  type="date"
                  required
                  label="Issue Date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="cursor-pointer"
                />

                <Input
                  id="cert-expiry"
                  type="date"
                  label="Expiration Date (Optional)"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="cursor-pointer"
                />
              </div>

              {/* License fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="cert-id"
                  type="text"
                  label="Credential Identifier ID (Optional)"
                  placeholder="e.g. AWS-ASA-49033"
                  value={credentialId}
                  onChange={(e) => setCredentialId(e.target.value)}
                  className="font-mono"
                />

                <Input
                  id="cert-url"
                  type="url"
                  label="Credential Verification URL (Optional)"
                  placeholder="https://credly.com/credentials/..."
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                />
              </div>

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                >
                  Save Certificate Profile
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CertificatesPage;
