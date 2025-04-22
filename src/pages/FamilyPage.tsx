
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

type FamilyMember = {
  id: string;
  name: string;
  role: 'Admin' | 'Member' | 'Driver' | 'Nanny' | 'Home Chef';
  status: 'Active' | 'Pending';
};

const FamilyPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'You', role: 'Admin', status: 'Active' }
  ]);
  
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<FamilyMember['role']>('Member');
  
  const inviteCode = 'KOFFA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  const handleInvite = () => {
    if (!inviteEmail) return;
    
    // In a real app, this would send an invitation email
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      role: inviteRole,
      status: 'Pending'
    };
    
    setMembers(prev => [...prev, newMember]);
    setIsInviting(false);
    setInviteEmail('');
    
    toast.success('Invitation sent successfully!');
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    toast.success('Invitation code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Family Circle" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-heading text-kitchen-dark">Family Members</h2>
          
          <Dialog open={isInviting} onOpenChange={setIsInviting}>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <UserPlus />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Family Member</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="Enter email address" 
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="role">Role</label>
                  <Select 
                    value={inviteRole} 
                    onValueChange={(value) => setInviteRole(value as FamilyMember['role'])}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Member">Family Member</SelectItem>
                      <SelectItem value="Driver">Family Driver</SelectItem>
                      <SelectItem value="Nanny">Nanny</SelectItem>
                      <SelectItem value="Home Chef">Home Chef</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <label>Invitation Code</label>
                  <div className="flex">
                    <Input value={inviteCode} readOnly className="flex-1" />
                    <Button variant="outline" onClick={copyInviteCode} className="ml-2">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Share this code with your family member</p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviting(false)}>Cancel</Button>
                <Button onClick={handleInvite}>Send Invitation</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="space-y-4">
          {members.map(member => (
            <div 
              key={member.id}
              className="rounded-lg border border-muted bg-white p-4 shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-kitchen-wood text-white flex items-center justify-center">
                  <span className="text-lg font-semibold">{member.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{member.name}</h3>
                    {member.status === 'Pending' && (
                      <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded">Pending</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </div>
                {member.id !== '1' && (
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                    Remove
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FamilyPage;
