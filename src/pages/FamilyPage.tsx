
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserPlus, Copy, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';
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
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

type FamilyMember = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Member' | 'Driver' | 'Nanny' | 'Home Chef';
  status: 'Active' | 'Pending';
  dateAdded: string;
};

const FamilyPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState<FamilyMember[]>([
    { 
      id: '1', 
      name: 'You', 
      email: 'user@example.com', 
      role: 'Admin', 
      status: 'Active',
      dateAdded: new Date().toISOString()
    }
  ]);
  
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<FamilyMember['role']>('Member');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const inviteCode = 'KOFFA-' + Math.random().toString(36).substring(2, 8).toUpperCase();

  useEffect(() => {
    // Reset the copied state after 2 seconds
    if (copied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  const handleInvite = () => {
    if (!inviteEmail) {
      toast.error('Please enter an email address');
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, this would send an invitation email
      const newMember: FamilyMember = {
        id: Date.now().toString(),
        name: inviteEmail.split('@')[0],
        email: inviteEmail,
        role: inviteRole,
        status: 'Pending',
        dateAdded: new Date().toISOString()
      };
      
      setMembers(prev => [...prev, newMember]);
      setIsInviting(false);
      setInviteEmail('');
      setLoading(false);
      
      toast.success('Invitation sent successfully!');
    }, 1500);
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    toast.success('Invitation code copied to clipboard!');
  };

  const removeMember = (id: string) => {
    setMembers(prev => prev.filter(member => member.id !== id));
    toast.success('Member removed successfully');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-kitchen-cream kitchen-texture flex flex-col">
      <Header title="Family Circle" showBack={true} onBack={() => navigate(-1)} showSettings={false} />
      
      <main className="flex-1 px-4 py-6 mb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={container}
        >
          <motion.div 
            className="flex justify-between items-center mb-6"
            variants={item}
          >
            <h2 className="text-2xl font-bold font-heading text-kitchen-dark">Family Members</h2>
            
            <Dialog open={isInviting} onOpenChange={setIsInviting}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-kitchen-wood text-white hover:bg-kitchen-wood/90 border-none">
                  <UserPlus />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite Family Member</DialogTitle>
                  <DialogDescription>
                    Send an invitation to add a new member to your family circle.
                  </DialogDescription>
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
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Share this code with your family member</p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsInviting(false)}>Cancel</Button>
                  <Button onClick={handleInvite} disabled={loading}>
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
          
          <motion.div 
            className="space-y-4"
            variants={container}
          >
            {members.map(member => (
              <motion.div 
                key={member.id}
                className="rounded-lg border border-muted bg-white p-4 shadow-sm hover:shadow-md transition-all duration-300"
                variants={item}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-kitchen-wood text-white flex items-center justify-center">
                    <span className="text-lg font-semibold">{member.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h3 className="font-medium">{member.name}</h3>
                      {member.status === 'Pending' ? (
                        <Badge variant="outline" className="ml-2 text-xs bg-yellow-100 border-yellow-200 text-yellow-800">Pending</Badge>
                      ) : (
                        <Badge variant="outline" className="ml-2 text-xs bg-green-100 border-green-200 text-green-800">Active</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                    {member.email && <p className="text-xs text-muted-foreground">{member.email}</p>}
                  </div>
                  {member.id !== '1' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => removeMember(member.id)}
                    >
                      <X size={18} />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}

            {members.length === 1 && (
              <motion.div 
                className="text-center p-8 border border-dashed border-muted-foreground/20 rounded-lg"
                variants={item}
              >
                <p className="text-muted-foreground">No family members yet. Invite someone to join!</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setIsInviting(true)}
                >
                  <UserPlus className="mr-2 h-4 w-4" /> Add Family Member
                </Button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FamilyPage;
