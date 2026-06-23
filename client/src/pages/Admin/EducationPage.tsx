import React, { useState, useCallback, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  GraduationCap,
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  Award,
} from 'lucide-react';
import { Card, Input, Textarea, Button, Heading, Paragraph, Span, Label } from '../../components/common/UI';
import toast from 'react-hot-toast';
import { EducationType } from '../../types';

const EducationPage: React.FC = () => {
  const { education, addEducation, updateEducation, deleteEducation, isLoading } = usePortfolio();

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [editingEdu, setEditingEdu] = useState<EducationType | null>(null);

  // Form states
  const [institution, setInstitution] = useState<string>('');
  const [degree, setDegree] = useState<string>('');
  const [field, setField] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isCurrent, setIsCurrent] = useState<boolean>(false);
  const [description, setDescription] = useState<string>('');
  const [grade, setGrade] = useState<string>('');

  const resetForm = useCallback(() => {
    setInstitution('');
    setDegree('');
    setField('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    setGrade('');
    setEditingEdu(null);
  }, []);

  const handleOpenCreate = useCallback(() => {
    resetForm();
    setModalOpen(true);
  }, [resetForm]);

  const handleOpenEdit = useCallback((item: EducationType) => {
    setEditingEdu(item);
    setInstitution(item.institution);
    setDegree(item.degree);
    setField(item.field);
    setStartDate(item.startDate);
    setEndDate(item.endDate || '');
    setIsCurrent(item.isCurrent || false);
    setDescription(item.description || '');
    setGrade(item.grade || '');
    setModalOpen(true);
  }, []);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!institution || !degree || !field || !startDate) {
      toast.error('Institution, Degree, Field, and Start Date are required.');
      return;
    }

    const payload = {
      institution,
      degree,
      field,
      startDate,
      endDate: isCurrent ? '' : endDate,
      isCurrent,
      description,
      grade,
    };

    let success = false;
    if (editingEdu) {
      success = await updateEducation(editingEdu.id, payload);
    } else {
      success = await addEducation(payload);
    }

    if (success) {
      setModalOpen(false);
      resetForm();
    }
  }, [institution, degree, field, startDate, isCurrent, endDate, description, grade, editingEdu, updateEducation, addEducation, resetForm]);

  const handleDelete = useCallback(async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete the education record for "${name}"?`)) {
      await deleteEducation(id);
    }
  }, [deleteEducation]);

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

  // Memoized sorted listing by order value
  const sortedEducation = useMemo(() => {
    return [...education].sort((a, b) => a.order - b.order);
  }, [education]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-200 dark:border-slate-800 gap-4">
        <div className="space-y-1">
          <Heading level={1} className="text-slate-900 dark:text-white leading-tight">
            Manage Education
          </Heading>
          <Paragraph className="text-xs text-slate-500 font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-relaxed bg-transparent">
            Define degree list, credential logs, and academic timelines
          </Paragraph>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="flex items-center px-4 py-2 cursor-pointer"
        >
          <Plus size={15} className="mr-1.5" />
          Add Education Item
        </Button>
      </div>

      {/* Grid listing */}
      {sortedEducation.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sortedEducation.map((edu) => (
            <Card
              key={edu.id}
              className="flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div className="space-y-2 text-left">
                {/* Visual date block */}
                <Span className="inline-flex items-center space-x-1 py-1 px-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 rounded-md uppercase">
                  <Calendar size={11} className="mr-1 text-slate-400" />
                  {formatDate(edu.startDate)} &mdash; {edu.isCurrent ? 'Current' : formatDate(edu.endDate)}
                </Span>

                <div className="space-y-1">
                  <Heading level={4} className="text-base font-bold text-slate-900 dark:text-white mb-0.5">{edu.degree}</Heading>
                  <Paragraph className="text-xs font-semibold text-slate-505 dark:text-slate-400 uppercase tracking-widest text-blue-600 dark:text-blue-400 leading-relaxed bg-transparent">
                    {edu.institution} &bull; {edu.field}
                  </Paragraph>
                </div>

                {edu.grade && (
                  <div className="inline-flex items-center space-x-1.5 px-2 bg-emerald-50 dark:bg-emerald-950/20 rounded-md text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                    <Award size={10} />
                    <Span className="text-emerald-750 dark:text-emerald-455 font-bold">Grade: {edu.grade}</Span>
                  </div>
                )}

                <Paragraph className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-normal whitespace-pre-wrap mt-2 bg-transparent">
                  {edu.description}
                </Paragraph>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-2 mt-4">
                <Button
                  onClick={() => handleOpenEdit(edu)}
                  variant="outline"
                  className="px-3 py-1.5 h-auto text-xs font-bold inline-flex items-center space-x-1 transition cursor-pointer"
                >
                  <Edit2 size={12} className="mr-1" />
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(edu.id, edu.institution)}
                  variant="outline"
                  className="px-3 py-1.5 h-auto text-xs font-bold inline-flex items-center space-x-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/25 border-slate-200 dark:border-slate-805 cursor-pointer"
                >
                  <Trash2 size={12} className="mr-1" />
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-16 border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-transparent shadow-xs">
          <Paragraph className="text-slate-500 font-medium bg-transparent">No education items added yet.</Paragraph>
          <button onClick={handleOpenCreate} className="mt-2 text-xs text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer">
            Write academic record
          </button>
        </Card>
      )}

      {/* ======================================= */}
      {/* DIALOG MODAL                            */}
      {/* ======================================= */}
      {modalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg p-0 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 dark:border-slate-850 bg-slate-50 dark:bg-slate-950">
              <Heading level={5} className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                {editingEdu ? 'Edit Academic Profile' : 'Add Academic Credentials'}
              </Heading>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable forms */}
            <form onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 text-xs text-left">
              <Input
                id="edu-inst"
                type="text"
                required
                label="Institution name"
                placeholder="e.g. Stanford University"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="edu-deg"
                  type="text"
                  required
                  label="Degree Title"
                  placeholder="e.g. Master of Science"
                  value={degree}
                  onChange={(e) => setDegree(e.target.value)}
                />

                <Input
                  id="edu-field"
                  type="text"
                  required
                  label="Field of study"
                  placeholder="e.g. Computer Science"
                  value={field}
                  onChange={(e) => setField(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="edu-start"
                  type="date"
                  required
                  label="Start Date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="cursor-pointer"
                />

                <Input
                  id="edu-end"
                  type="date"
                  disabled={isCurrent}
                  label="End Date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex-col space-y-4">
                {/* Active check toggle */}
                <div className="flex items-center">
                  <label className="flex items-center font-bold text-slate-705 dark:text-slate-350 uppercase cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isCurrent}
                      onChange={() => setIsCurrent(!isCurrent)}
                      className="rounded border-slate-300 dark:border-slate-800 text-blue-600 focus:ring-blue-500 h-4.5 w-4.5 mr-2"
                    />
                    <Span className="text-xs font-bold text-slate-705 dark:text-slate-350 uppercase">I am currently studying here</Span>
                  </label>
                </div>

                <Input
                  id="edu-grade"
                  type="text"
                  label="Grade / Honor Badge (Optional)"
                  placeholder="e.g. GPA 3.94 / Magna Cum Laude"
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                />
              </div>

              <Textarea
                id="edu-desc"
                rows={4}
                label="Description / Courses summary"
                placeholder="Completed research in web decoders, served as TA..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              {/* Submit panel */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end space-x-3.5">
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
                  Save Academic log
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default EducationPage;
