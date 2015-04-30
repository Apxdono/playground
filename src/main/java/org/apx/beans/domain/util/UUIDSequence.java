/**
 * Created by Buzz on 18.02.2015.
 */
package org.apx.beans.domain.util;

import org.eclipse.persistence.internal.databaseaccess.Accessor;
import org.eclipse.persistence.internal.sessions.AbstractSession;
import org.eclipse.persistence.sequencing.Sequence;

import java.util.UUID;
import java.util.Vector;


public class UUIDSequence extends Sequence {

    private static final long serialVersionUID = -3184457810264720441L;

    public UUIDSequence() {
        super();
    }

    public UUIDSequence(String name) {
        super(name);
    }

    @Override
    public Object getGeneratedValue(Accessor accessor,
                                    AbstractSession writeSession, String seqName) {
        return UUID.randomUUID().toString().toUpperCase();
    }

    @Override
    public Vector getGeneratedVector(Accessor accessor,
                                     AbstractSession writeSession, String seqName, int size) {
        Vector v = new Vector();
        int i =0;
        while(i < size){
            v.add(getGeneratedValue(accessor, writeSession, seqName));
        }
        return v;
    }

    @Override
    public void onConnect() {
    }

    @Override
    public void onDisconnect() {
    }

    @Override
    public boolean shouldAcquireValueAfterInsert() {
        return false;
    }

    @Override
    public boolean shouldUseTransaction() {
        return false;
    }

    @Override
    public boolean shouldUsePreallocation() {
        return false;
    }

}
